import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';

import * as Progress from 'react-native-progress';

import ChatServices from '../../../services/ChatServices';
import { ChatData } from '../../../types/ChatTypes';
import { Colors } from '../../../constants/Colors';
import { useAuth } from '../../../context/AuthContext';

const UserCard = ({ chatRoomID, onPress }: { chatRoomID: string, onPress?: () => void }) => {
    const { user } = useAuth();
    const [chatData, setChatData] = useState<ChatData | null>(null);

    useEffect(() => {
        const handleChatData = async () => {
            setChatData(await ChatServices.fetchChatData(chatRoomID));
        }
        handleChatData();
    });

    if (!chatData) {
        return (
            <View className="w-full p-4 flex-row">
                <View className="bg-gray-400 rounded-full h-16 w-16 mr-5" />
                <Progress.Bar
                    indeterminate={true}
                    indeterminateAnimationDuration={700}
                    height={24}
                    width={null}
                    color="#AAAAAA"
                    unfilledColor="#DDDDDD"
                    borderWidth={0}
                    className="flex-1" />
            </View>
        );
    }

    return (
        <TouchableOpacity className="w-full p-4" onPress={onPress}>
            <View className="flex-row">
                <Image source={require('../../../assets/favicon.png')} className="mr-5"></Image>
                <View className="w-5/6">
                    <Text className="text-xl" numberOfLines={1} ellipsizeMode="tail">{chatData.name}</Text>
                    <Text className="font-light" numberOfLines={1} ellipsizeMode="tail">{chatData.lastMessage}</Text>
                </View>
            </View>
        </TouchableOpacity>
    );
};

export default UserCard;