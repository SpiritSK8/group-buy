import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';

import User from '../../../types/User';

const UserCard = ({ user, onPress }: { user: User, onPress?: () => void}) => {
    return (
        <TouchableOpacity className='w-full p-4 border-b border-gray-300' onPress={onPress}>
            <View className='flex-row'>
                <Image source={require('../../../assets/favicon.png')} className='mr-5'></Image>
                <View>
                    <Text className='text-xl'>{user.name}</Text>
                    <Text className='font-light'>{user.lastChat}</Text>
                </View>
            </View>
        </TouchableOpacity>
    );
};

export default UserCard;