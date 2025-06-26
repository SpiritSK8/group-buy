import React from 'react';
import { View, FlatList } from 'react-native';

import User from '../../types/User';
import UserCard from './components/UserCard';

// TODO: Remove test data.
import CHAT_LIST_TEST_DATA from './test/ChatListTest';
import { ChatListNavigationProp } from '../../types/Navigations';

type Props = {
    navigation: ChatListNavigationProp;
}

const ChatList = ({ navigation }: Props) => {
    return (
        <View className='w-full'>
            <FlatList
                data={CHAT_LIST_TEST_DATA}
                renderItem={({ item }: { item: User }) => (
                    <UserCard user={item} onPress={() => navigation.navigate('Chat', { chatRoomId: item.id })}></UserCard>
                )}
                keyExtractor={(item) => item.id} />
        </View>
    );
};

export default ChatList;