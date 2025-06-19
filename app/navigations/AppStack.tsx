import React from "react";
import { Button } from "react-native";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { useAuth } from "../context/AuthContext";

import Deals from "../screens/(tabs)/Deals";
import Chats from "../screens/(tabs)/Chats";
import GroupBuys from "../screens/(tabs)/GroupBuys";
import Settings from "../screens/(tabs)/Settings";

const Tab = createBottomTabNavigator();

const AppStack = () => {
    const { onLogout } = useAuth();

    return (
        // Right now the sign out button is visible in every page
        <Tab.Navigator>
            <Tab.Screen name={'Deals'} component={Deals} />
            <Tab.Screen name={'GroupBuys'} component={GroupBuys} />
            <Tab.Screen name={'Chats'} component={Chats} />
            <Tab.Screen name={'Settings'} component={Settings} options={{
                headerRight: () => <Button onPress={onLogout} title="Sign Out" />
            }} />
        </Tab.Navigator>
    )
}

export default AppStack