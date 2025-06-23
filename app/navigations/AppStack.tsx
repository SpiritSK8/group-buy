import React from "react";
import { Button } from "react-native";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { useAuth } from "../context/AuthContext";

import Deals from "../screens/(tabs)/Deals";
import GroupBuys from "../screens/(tabs)/GroupBuys";
import Settings from "../screens/(tabs)/Settings";
import ChatStack from "./ChatStack";

const Tab = createBottomTabNavigator();

const AppStack = () => {
    return (
        <Tab.Navigator
            screenOptions={{
                headerStyle: { backgroundColor: '#7766dd', height: 80 },
            }}
        >
            <Tab.Screen name='Deals' component={Deals} />
            <Tab.Screen name='GroupBuys' component={GroupBuys} />
            <Tab.Screen name='Chats' component={ChatStack} options={{ headerShown: false }}/>
            <Tab.Screen name='Settings' component={Settings} />
        </Tab.Navigator>
    );
};

export default AppStack;