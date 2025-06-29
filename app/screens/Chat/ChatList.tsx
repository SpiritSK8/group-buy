import React, { useEffect, useLayoutEffect, useState } from 'react';
import { View, FlatList, ActivityIndicator } from 'react-native';

import User from '../../types/User';
import ChatCard from './components/ChatCard';

// TODO: Remove test data.
import CHAT_LIST_TEST_DATA from './test/ChatListTest';
import { ChatListNavigationProp } from '../../types/Navigations';
import { Colors } from '../../constants/Colors';
import { collection, getDocs, limit, onSnapshot, orderBy, query, startAfter, where } from 'firebase/firestore';
import { database } from '../../firebaseConfig';
import { useAuth } from '../../context/AuthContext';

type Props = {
    navigation: ChatListNavigationProp;
}

const ChatList = ({ navigation }: Props) => {
    const { user } = useAuth();

    const [chats, setChats] = useState<any[]>([]);

    useLayoutEffect(() => {
        if (user?.uid) {
            const q = query(
                collection(database, 'chats'),
                where('participants', 'array-contains', user.uid),
                orderBy('lastMessageAt', 'desc')
            );

            const unsubscribe = onSnapshot(q, (snapshot) => {
                const chats = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setChats(chats);
            });

            return unsubscribe;
        }
    }, []);

    return (
        <View className="w-full" style={{ backgroundColor: Colors.light.background }}>
            <FlatList
                data={chats}
                contentContainerStyle={{ flexGrow: 1 }}
                renderItem={({ item }) => (
                    <ChatCard chatRoomID={item.id} onPress={() => navigation.navigate('Chat', { chatRoomID: item.id })}></ChatCard>
                )}
                keyExtractor={(item) => item.id}
            />

        </View>
    );
};

export default ChatList;