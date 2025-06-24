import { View, Text } from 'react-native';
import React, { useState, useCallback, useEffect, useLayoutEffect } from 'react';

import { collection, addDoc, orderBy, query, onSnapshot } from 'firebase/firestore';
import { auth, database } from '../../firebaseConfig';

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
            setMessages(
                snapshot.docs.map(doc => ({
                    _id: doc.id,
                    createdAt: doc.data().createdAt.toDate(),
                    text: doc.data().text,
                    user: doc.data().user
                }))
            );
        });
        return unsubscribe;
    }, []);

    const onSend = useCallback((messages = []) => {
        setMessages((previousMessages: any) => GiftedChat.append(previousMessages, messages));
        const { _id, createdAt, text, user } = messages[0];
        addDoc(collection(database, 'chats'), { _id, createdAt, text, user });
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
                messages={messages}
                onSend={messages => onSend(messages as any)}
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