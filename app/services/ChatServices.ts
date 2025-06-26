import { addDoc, collection, doc, DocumentData, getDoc, onSnapshot, orderBy, query, QuerySnapshot, serverTimestamp, setDoc, Timestamp, Unsubscribe } from 'firebase/firestore';
import { auth, database } from '../firebaseConfig';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, updateProfile, User } from 'firebase/auth';
import { ChatMessage } from '../types/ChatTypes';
import FirebaseServices from './FirebaseServices';
import { IMessage } from 'react-native-gifted-chat';

class ChatServices {
    // Creates a chat room and returns the id of the chat room.
    static async createChatRoom(name: string, photoUrl: string): Promise<string> {
        try {
            return (await addDoc(collection(database, 'chats'), { name, photoUrl })).id;
        } catch (error) {
            console.error('An error occured.');
            return '';
        }
    }

    static async joinChatRoom(userUid: string, chatRoomId: string): Promise<void> {
        try {
            const userDoc = await getDoc(doc(database, 'chats', chatRoomId));
            if (!userDoc.exists()) {
                // The specified chat room doesn't exist.
                return;
            }

            if (await this.isUserInChatRoom(userUid, chatRoomId)) {
                // User is already inside this chat room.
                return;
            } else {
                await setDoc(doc(database, 'chats', chatRoomId, 'participants', userUid), {});
            }
        } catch (error) {
            console.error('An error occured.');
        }
    }

    static async isUserInChatRoom(userUid: string, chatRoomId: string): Promise<boolean> {
        try {
            const userDoc = await getDoc(doc(database, 'chats', chatRoomId, 'participants', userUid));
            return userDoc.exists();
        } catch (error) {
            console.error('An error occured.');
            return false;
        }
    }

    static async sendMessage(_id: string, text: string, senderUid: string, chatRoomId: string): Promise<void> {
        const message: ChatMessage = {
            _id,
            createdAt: (serverTimestamp() as Timestamp),
            text,
            senderUid
        }

        try {
            await addDoc(
                collection(database, 'chats', chatRoomId, 'messages'),
                message
            );
            console.log('Message sent successfully');
        } catch (error) {
            console.error('Failed to send message:', error);
        }
    }

    static listenToMessages(chatRoomId: string, onUpdate: (messages: IMessage[]) => void, onError?: (error: any) => void): Unsubscribe {
        const q = query(
            collection(database, 'chats', chatRoomId, 'messages'),
            orderBy('createdAt', 'desc')
        );

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
                                _id: data.senderUid,
                                name: await FirebaseServices.getUserDisplayName(data.senderUid),
                                avatar: await FirebaseServices.getUserPhotoURL(data.senderUid),
                            },
                        } as IMessage;
                    })
                );

                onUpdate(messages.filter((msg) => msg !== null));
            },
            (error) => {
                console.error('Chat snapshot error:', error);
                if (onError) onError(error);
            }
        );

        return unsubscribe;
    }
}

export default ChatServices;