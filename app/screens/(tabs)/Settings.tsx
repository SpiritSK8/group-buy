import { View, Text, Button, TouchableOpacity } from 'react-native';
import React, { useLayoutEffect } from 'react';

import { useNavigation } from 'expo-router';
import { useAuth } from '../../context/AuthContext';

const Settings = () => {
    const navigation = useNavigation();

    // Sign out button on top-right.
    const { onLogout } = useAuth();
    useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => 
                <TouchableOpacity className='mr-2 bg-orange-300 p-2' onPress={onLogout}>
                    <Text>Sign Out</Text>
                </TouchableOpacity>
        })
    }, []);

    // Page content.
    return (
        <View>
            <Text>Settings</Text>
        </View>
    );
};

export default Settings;