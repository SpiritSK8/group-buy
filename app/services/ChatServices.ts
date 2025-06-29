import { addDoc, collection, doc, DocumentData, getDoc, onSnapshot, orderBy, query, QuerySnapshot, serverTimestamp, setDoc, Timestamp, Unsubscribe } from 'firebase/firestore';
import { database } from '../firebaseConfig';
import UserServices from './UserServices';

import { IMessage } from 'react-native-gifted-chat';

import { ChatMessage } from '../types/ChatTypes';

class ChatServices {
    // Creates a chat room and returns the id of the chat room.
    static async createChatRoom(name: string, photoURL: string): Promise<string | null> {
        try {
            return (await addDoc(collection(database, 'chats'), { name, photoURL })).id;
        } catch (error) {
            console.error('An error occured.');
            return null;
        }
    }

    static async joinChatRoom(userUID: string, chatRoomID: string): Promise<void> {
        try {
            const userDoc = await getDoc(doc(database, 'chats', chatRoomID));
            if (!userDoc.exists()) {
                // The specified chat room doesn't exist.
                return;
            }

            if (await this.isUserInChatRoom(userUID, chatRoomID)) {
                // User is already inside this chat room.
                return;
            } else {
                await setDoc(doc(database, 'chats', chatRoomID, 'participants', userUID), {});
            }
        } catch (error) {
            console.error('An error occured.');
        }
    }

    static async isUserInChatRoom(userUID: string, chatRoomID: string): Promise<boolean> {
        try {
            const userDoc = await getDoc(doc(database, 'chats', chatRoomID, 'participants', userUID));
            return userDoc.exists();
        } catch (error) {
            console.error('An error occured.');
            return false;
        }
    }

    static async sendMessage(_id: string, text: string, senderUID: string, chatRoomID: string): Promise<void> {
        const message: ChatMessage = {
            _id,
            createdAt: (serverTimestamp() as Timestamp),
            text,
            senderUID
        }

        try {
            await addDoc(
                collection(database, 'chats', chatRoomID, 'messages'),
                message
            );
            console.log('Message sent successfully');
        } catch (error) {
            console.error('Failed to send message:', error);
        }
    }

    // Listens to changes in messages for the specified chat room. Upon receiving new messages, fires onUpdate.
    // Returns an unsubscribe function that can be called to stop the listener.
    static listenToMessages(chatRoomID: string, onUpdate: (messages: IMessage[]) => void, onError?: (error: any) => void): Unsubscribe {
        const q = query(
            collection(database, 'chats', chatRoomID, 'messages'),
            orderBy('createdAt', 'desc')
        );

        /**
         * To prevent cheating time (e.g. creating a message whose time is set in the future), the message is first sent
         * without a createdAt value, but a method is attached (serverTimestamp()) that tells the database to populate the createdAt
         * field with the server's time after it receives the message.
         * 
         * This snapshot listener detects for changes in the chats database. So, upon sending a message, it fires 2 times:
         * 1. When the message is first sent (createdAt is still not set).
         * 2. When the database populates the createdAt field with the server time.
         * 
         * We don't want to display messages whose createdAt is still null, so we filter them out.
         */
        const unsubscribe = onSnapshot(
            q,
            async (snapshot: QuerySnapshot<DocumentData>) => {
                const messages = await Promise.all(
                    snapshot.docs.map(async (doc) => {
                        const data = doc.data();
                        if (!data.createdAt) return null;

                        return {
                            _id: doc.id,
                            createdAt: data.createdAt.toDate(),
                            text: data.text,
                            user: {
                                _id: data.senderUID,
                                name: await UserServices.getUserDisplayName(data.senderUID),
                                avatar: await UserServices.getUserPhotoURL(data.senderUID),
                            },
                        } as IMessage;
                    })
                );

                onUpdate(messages.filter((msg) => msg !== null));
            },
            (error) => {
                if (onError) onError(error);
            }
        );

        return unsubscribe;
    }
}

export default ChatServices;