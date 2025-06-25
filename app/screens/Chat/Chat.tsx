import { View, Text } from 'react-native';
import React, { useState, useCallback, useLayoutEffect } from 'react';

import { collection, addDoc, orderBy, query, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { database } from '../../firebaseConfig';

import { GiftedChat } from 'react-native-gifted-chat';

import { useAuth } from '../../context/AuthContext';
import { useNavigation } from 'expo-router';

const Chat = ({ route }: { route: any }) => {
    const [messages, setMessages] = useState<any>([]);

    const navigation = useNavigation();

    const { user } = useAuth();

    useLayoutEffect(() => {
        const collectionRef = collection(database, 'chats');
        const q = query(collectionRef, orderBy('createdAt', 'desc'));

        const unsubscribe = onSnapshot(q, snapshot => {
            /**
             * To prevent cheating time (e.g. creating a message whose time is set in the future), the message is first sent
             * without a createdAt value, but a method is attached (serverTimestamp()) that tells the database to populate the createdAt
             * field with the server's time after it receives the message.
             * 
             * This snapshot listener detects for changes in the chats database. So, upon sending a message, it fires 2 times:
             * 1. When the message is first sent (createdAt is still null).
             * 2. When the database populates the createdAt field with the server time.
             * 
             * We don't want to display messages in whose createdAt is still null, so we filter it out.
             */
            setMessages(
                snapshot.docs.map(doc => {
                    const data = doc.data();

                    if (!data.createdAt) return null; // Ignore messages whose timestamp is still pending.

                    return {
                        _id: doc.id,
                        createdAt: data.createdAt.toDate(),
                        text: data.text,
                        user: data.user
                    };
                }).filter(doc => doc != null) // Filters out nulls.
            );
        });

        return unsubscribe;
    }, []);

    const onSend = useCallback((newMessages = []) => {
        // First item in newMessages is the message that's just been sent.
        const { _id, text, user } = newMessages[0];

        // We add this to the database.
        addDoc(collection(database, 'chats'),
            {
                _id,
                createdAt: serverTimestamp(),
                text,
                user
            });
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
                    _id: user.uid,
                    avatar: 'https://i.pravatar.cc/300' // TODO: Change with actual user's profile picture.
                }}
                messagesContainerStyle={{
                    backgroundColor: '#fff'
                }}
            />
        );
    }
};

export default Chat;