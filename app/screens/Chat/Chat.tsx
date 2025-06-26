import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import React, { useState, useCallback, useLayoutEffect, useEffect } from 'react';

import { collection, addDoc, orderBy, query, onSnapshot, serverTimestamp, Timestamp } from 'firebase/firestore';
import { database } from '../../firebaseConfig';

import { GiftedChat, IMessage } from 'react-native-gifted-chat';

import { useAuth } from '../../context/AuthContext';
import { ChatNavigationProp, ChatRouteProp } from '../../types/Navigations';
import FirebaseServices from '../../services/FirebaseServices';
import { ChatMessage } from '../../types/ChatTypes';
import ChatServices from '../../services/ChatServices';

type Props = {
    navigation: ChatNavigationProp;
    route: ChatRouteProp;
};

const Chat = ({ navigation, route }: Props) => {
    const [messages, setMessages] = useState<IMessage[]>([]);
    const [hasPermission, setHasPermission] = useState<boolean | null>(null);

    const { user } = useAuth();

    const chatRoomId: string = route.params.chatRoomId;

    useLayoutEffect(() => {
        console.log("Opening chat with: " + chatRoomId);

        const unsubscribe = ChatServices.listenToMessages(
            chatRoomId,
            (newMessages) => {
                setHasPermission(true);
                setMessages(newMessages);
            },
            (error) => {
                if (error.code === 'permission-denied') {
                    setHasPermission(false);
                }
            }
        );

        return unsubscribe;
    }, [chatRoomId]);

    const onSend = useCallback((message: IMessage) => {
        try {
            ChatServices.sendMessage(
                message._id.toString(),
                message.text,
                message.user._id.toString(),
                chatRoomId);
        } catch (error: any) {
            if (error.code === 'permission-denied') {
                setHasPermission(false);
            }
        }
    }, [chatRoomId]);

    if (!user?.uid) {
        return (
            <View className='flex-1 justify-center h-full'>
                <Text>You must be logged in to chat.</Text>
            </View>
        )
    } else if (hasPermission === null) {
        return (
            <View className="flex-1 justify-center items-center">
                <ActivityIndicator />
            </View>
        );
    } else if (!hasPermission) {
        return (
            <View className='flex-1 justify-center items-center'>
                <Text>You do not have access to this chat room.</Text>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Text className='text-blue-600'>Go Back</Text>
                </TouchableOpacity>
            </View>
        );
    } else {
        return (
            <GiftedChat
                messages={GiftedChat.append([], messages)}
                onSend={(messages: IMessage[]) => onSend(messages[0])}
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