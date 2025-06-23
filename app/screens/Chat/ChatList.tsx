import React from 'react';
import { View, FlatList } from 'react-native';
import { useNavigation } from 'expo-router';

import User from './types/User';
import UserCard from './components/UserCard';

// TODO: Remove test data.
import CHAT_LIST_TEST_DATA from './test/ChatListTest';

const ChatList = () => {
    const navigation = useNavigation<any>();

    return (
        <View className='w-full'>
            <FlatList
                data={CHAT_LIST_TEST_DATA}
                renderItem={({ item }: { item: User }) => (
                    <UserCard user={item} onPress={() => navigation.navigate('Chat', { name: item.name })}></UserCard>
                )}
                keyExtractor={(item) => item.id.toString()} />
        </View>
    );
};

export default ChatList;