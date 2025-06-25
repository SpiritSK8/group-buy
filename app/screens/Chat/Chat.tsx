import { View, Text, TouchableOpacity } from 'react-native';
import React, { useState, useCallback, useEffect, useLayoutEffect } from 'react';

import { collection, addDoc, orderBy, query, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { auth, database } from '../../firebaseConfig';

import { GiftedChat } from 'react-native-gifted-chat';

import { useAuth } from '../../context/AuthContext';
import { useNavigation } from 'expo-router';

const Chat = ({ route }: { route: any }) => {
    const [messages, setMessages] = useState<any>([]);
    const [pendingMessages, setPendingMessages] = useState<any[]>([]);

    const navigation = useNavigation();

    const { user } = useAuth();

    useLayoutEffect(() => {
        const collectionRef = collection(database, 'chats');
        const q = query(collectionRef, orderBy('createdAt', 'desc'),);

        const unsubscribe = onSnapshot(q, snapshot => {
            // When a message is sent to the server, its createdAt field will be null.
            // We don't want to display these yet, so we filter out messages which have no createdAt value.
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

            // We store new messages in pendingMessages.
            // These are messages which have been sent to the server, but the server hasn't processed the timestamp yet.
            setPendingMessages(prev =>
                // Filter out any pending messages that now exist in Firestore.
                prev.filter(pm => !messages.some((m: any) => m._id === pm._id))
            );
        });

        return unsubscribe;
    }, []);

    const onSend = useCallback((newMessages = []) => {
        const { _id, text, user } = newMessages[0];
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
                messages={GiftedChat.append(messages, pendingMessages)}
                onSend={(messages: any) => onSend(messages)}
                user={{
                    _id: user.uid,
                    avatar: 'https://i.pravatar.cc/300'
                }}
                messagesContainerStyle={{
                    backgroundColor: '#fff'
                }}
            />
        );
    }
};

export default Chat;