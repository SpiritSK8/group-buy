import { View, Text } from 'react-native';
import React, { useState, useCallback, useEffect } from 'react';

import { useAuth } from '../../context/AuthContext';

const Chat = ({ route }: { route: any }) => {
    const { user } = useAuth();

    return (
        <View>
            <Text>Chat with {route.params.name}</Text>
            <Text>You are {user?.user.email}</Text>
        </View>
    );
};

export default Chat;