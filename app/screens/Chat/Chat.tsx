import { View, Text } from 'react-native';
import React, { useState, useCallback, useLayoutEffect, useEffect } from 'react';

import { collection, addDoc, orderBy, query, onSnapshot, serverTimestamp, Timestamp } from 'firebase/firestore';
import { database } from '../../firebaseConfig';

import { GiftedChat, IMessage } from 'react-native-gifted-chat';

import { useAuth } from '../../context/AuthContext';
import { ChatNavigationProp, ChatRouteProp } from '../../types/Navigations';
import FirebaseServices from '../../services/FirebaseServices';
import { ChatMessage } from '../../types/ChatTypes';

type Props = {
    navigation: ChatNavigationProp;
    route: ChatRouteProp;
};

const Chat = ({ navigation, route }: Props) => {
    const [messages, setMessages] = useState<IMessage[]>([]);

    const { user } = useAuth();

    const receiverUID = route.params.uid;

    useLayoutEffect(() => {
        console.log("Opening chat with: " + receiverUID);

        const q = query(collection(database, 'chats', receiverUID, 'messages'), orderBy('createdAt', 'desc'));

        const unsubscribe = onSnapshot(q, async snapshot => {
            /**
             * To prevent cheating time (e.g. creating a message whose time is set in the future), the message is first sent
             * without a createdAt value, but a method is attached (serverTimestamp()) that tells the database to populate the createdAt
             * field with the server's time after it receives the message.
             * 
             * This snapshot listener detects for changes in the chats database. So, upon sending a message, it fires 2 times:
             * 1. When the message is first sent (createdAt is still null).
             * 2. When the database populates the createdAt field with the server time.
             * 
             * We don't want to display messages whose createdAt is still null, so we filter them out.
             */
            const messages = await Promise.all(
                // TODO: Cache the user's display name and profile pictures.
                snapshot.docs.map(async doc => {
                    const data = doc.data();

                    if (!data.createdAt) return null; // Ignore messages whose timestamp is still pending.

                    const message: IMessage = {
                        _id: doc.id,
                        createdAt: data.createdAt.toDate(),
                        text: data.text,
                        user: {
                            _id: data.senderUID,
                            name: await FirebaseServices.getUserDisplayName(data.senderUID),
                            avatar: await FirebaseServices.getUserPhotoURL(data.senderUID),
                        }
                    }

                    return message;
                })
            );

            setMessages(
                messages.filter(doc => doc != null) // Filters out nulls.
            );
        });

        return unsubscribe;
    }, []);

    const onSend = useCallback((newMessages: IMessage[] = []) => {
        // First item in newMessages is the message that's just been sent.
        // Note: This user is not the same as the user from useAuth().
        // This one refers to the user property of GiftedChat's messages.
        const { _id, text, user } = newMessages[0];

        const messageToSend: ChatMessage = {
            _id,
            createdAt: (serverTimestamp() as Timestamp),
            text,
            senderUID: user._id
        }
        // We add this to the database.
        addDoc(collection(database, 'chats', receiverUID, 'messages'), messageToSend);
    }, []);

    if (!user?.uid) {
        return (
            <View className='flex-1 justify-center h-full'>
                <Text>You must be logged in to chat.</Text>
            </View>
        )
    } else {
        return (
            <GiftedChat
                messages={GiftedChat.append([], messages)}
                onSend={(messages: any) => onSend(messages)}
                user={{
                    _id: user.uid
                }}
                messagesContainerStyle={{
                    backgroundColor: '#fff'
                }}
                renderUsernameOnMessage={true}
            />
        );
    }
};

export default Chat;