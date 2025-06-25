import { createNativeStackNavigator } from "@react-navigation/native-stack";

import React from 'react';

import ChatList from "../screens/Chat/ChatList";
import Chat from "../screens/Chat/Chat";
import { ChatStackParamList } from "../types/Navigations";

const Stack = createNativeStackNavigator<ChatStackParamList>();

const ChatStack = () => {
    return (
        <Stack.Navigator
            initialRouteName="ChatList"
            screenOptions={{
                headerShown: true,
                title: "Chat",
                headerStyle: {backgroundColor: '#7766dd'}
        }}>
            <Stack.Screen name="ChatList" component={ChatList} />
            <Stack.Screen name="Chat" component={Chat} />
        </Stack.Navigator>
    )
}

export default ChatStack;