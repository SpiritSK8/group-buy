import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import React, { useState, useCallback, useLayoutEffect } from 'react';

import { GiftedChat, IMessage } from 'react-native-gifted-chat';

import { useAuth } from '../../context/AuthContext';
import { ChatNavigationProp, ChatRouteProp } from '../../types/Navigations';
import ChatServices from '../../services/ChatServices';
import { Colors } from '../../constants/Colors';
import { useFocusEffect } from '@react-navigation/native';

type Props = {
    navigation: ChatNavigationProp;
    route: ChatRouteProp;
};

const Chat = ({ navigation, route }: Props) => {
    const [messages, setMessages] = useState<IMessage[]>([]);
    const [hasPermission, setHasPermission] = useState<boolean | null>(null);
    const [groupBuyID, setGroupBuyID] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const { user } = useAuth();

    const chatRoomID: string = route.params.chatRoomID;

    useFocusEffect(
        useCallback(() => {
            const loadChatData = async () => {
                setIsLoading(true);
                try {
                    const data = await ChatServices.fetchChatData(chatRoomID);
                    if (data) {
                        setGroupBuyID(data.groupBuyID);
                    }
                } catch (err) {
                    console.error('Failed to load chat.', err);
                } finally {
                    setIsLoading(false);
                }
            }

            loadChatData();
        }, [chatRoomID])
    );

    useLayoutEffect(() => {
        // Top-right button.
        navigation.setOptions({
            headerRight: () =>
                <TouchableOpacity
                    onPress={() =>
                        navigation.navigate("GroupBuySummary", { groupBuyID: groupBuyID })
                    }
                    className="w-30 py-2 px-6 mr-2 rounded-xl"
                    style={{ backgroundColor: Colors.secondary }}
                >
                    <Text className='text-l text-center font-medium'>Details</Text>
                </TouchableOpacity>
        });

        // Listen to messages.
        const unsubscribe = ChatServices.listenToMessages(
            chatRoomID,
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
    }, [chatRoomID, groupBuyID]);

    const onSend = useCallback((message: IMessage) => {
        try {
            ChatServices.sendMessage(
                message._id.toString(),
                message.text,
                message.user._id.toString(),
                chatRoomID);
        } catch (error: any) {
            if (error.code === 'permission-denied') {
                setHasPermission(false);
            }
        }
    }, [chatRoomID]);

    if (isLoading) {
        return (
            <View className="flex-1 justify-center">
                <ActivityIndicator size="large" />
            </View>
        );
    } else if (!user?.uid) {
        return (
            <View className="flex-1 justify-center h-full" style={{ backgroundColor: Colors.light.background }}>
                <Text>You must be logged in to chat.</Text>
            </View>
        )
    } else if (hasPermission === null) {
        return (
            <View className="flex-1 justify-center items-center" style={{ backgroundColor: Colors.light.background }}>
                <ActivityIndicator />
            </View>
        );
    } else if (!hasPermission) {
        return (
            <View className="flex-1 justify-center items-center" style={{ backgroundColor: Colors.light.background }}>
                <Text>You do not have access to this chat room.</Text>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Text className="text-blue-600">Go Back</Text>
                </TouchableOpacity>
            </View>
        );
    } else {
        return (
            <GiftedChat
                messages={messages}
                onSend={(messages: IMessage[]) => onSend(messages[0])}
                user={{
                    _id: user.uid
                }}
                messagesContainerStyle={{
                    backgroundColor: Colors.light.background
                }}
                renderUsernameOnMessage={true}
            />
        );
    }
};

export default Chat;