import { addDoc, collection, doc, DocumentData, getDoc, onSnapshot, orderBy, query, QuerySnapshot, serverTimestamp, setDoc, Timestamp, Unsubscribe, updateDoc } from 'firebase/firestore';
import { database } from '../firebaseConfig';
import UserServices from './UserServices';

import { IMessage } from 'react-native-gifted-chat';

import { ChatData, ChatMessage } from '../types/ChatTypes';

class ChatServices {
    // Creates a chat room and returns the id of the chat room.
    static async createAndJoinChatRoom(userUID: string, name: string, photoURL: string, groupBuyID: string): Promise<string | null> {
        try {
            return (await addDoc(collection(database, 'chats'),
                {
                    name,
                    groupBuyID,
                    photoURL,
                    participants: [userUID],
                    lastMessage: '',
                    lastMessageAt: serverTimestamp(),
                }
            )).id;
        } catch (error: any) {
            console.error('An error occured. ' + error.message);
            return null;
        }
    }

    static async joinChatRoom(userUID: string, chatRoomID: string): Promise<void> {
        try {
            const chatDoc = await getDoc(doc(database, 'chats', chatRoomID));
            if (!chatDoc.exists()) {
                // The specified chat room doesn't exist.
                return;
            }

            if (await this.isUserInChatRoom(userUID, chatRoomID)) {
                // User is already inside this chat room.
                return;
            }

            const participants = chatDoc.data().participants;
            participants.push(userUID);
            await updateDoc(doc(database, 'chats', chatRoomID), { participants });

        } catch (error: any) {
            console.error('An error occured. ' + error.message);
        }
    }

    static async isUserInChatRoom(userUID: string, chatRoomID: string): Promise<boolean> {
        try {
            const chatDoc = await getDoc(doc(database, 'chats', chatRoomID));
            if (chatDoc.exists()) {
                const participants = chatDoc.data().participants;
                return participants.includes(userUID);
            }

            return false;
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

            // Update last message sent for easier query.
            await updateDoc(doc(database, 'chats', chatRoomID), { lastMessage: text, lastMessageAt: serverTimestamp() });
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

    static async fetchChatData(chatRoomID: string): Promise<ChatData | null> {
        const chatDoc = await getDoc(doc(database, 'chats', chatRoomID));
        if (chatDoc.exists()) {
            const data = chatDoc.data();
            return {
                name: data.name,
                groupBuyID: data.groupBuyID,
                photoURL: data.photoURL,
                participants: data.participants,
                lastMessage: data.lastMessage,
                lastMessageAt: data.lastMessageAt
            } as ChatData;
        }

        return null;
    }
}

export default ChatServices;