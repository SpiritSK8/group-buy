import { createNativeStackNavigator } from '@react-navigation/native-stack';

import React from 'react';

import ChatList from '../screens/Chat/ChatList';
import Chat from '../screens/Chat/Chat';
import GroupBuySummary from '../screens/GroupBuySummary/GroupBuySummary';
import { ChatStackParamList } from '../types/Navigations';
import { Colors } from '../constants/Colors';

const Stack = createNativeStackNavigator<ChatStackParamList>();

const ChatStack = () => {
    return (
        <Stack.Navigator
            initialRouteName="ChatList"
            screenOptions={{
                headerShown: true,
                title: 'Chat',
                headerStyle: {backgroundColor: Colors.primary}
        }}>
            <Stack.Screen name="ChatList" component={ChatList} />
            <Stack.Screen name="Chat" component={Chat} />
            <Stack.Screen name="GroupBuySummary" component={GroupBuySummary} />
        </Stack.Navigator>
    )
}

export default ChatStack;