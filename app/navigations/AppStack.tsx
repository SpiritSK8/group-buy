import React from "react";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from "@expo/vector-icons";

import DealsStack from "./DealsStack";
import GroupBuys from "../screens/(tabs)/GroupBuys";
import Settings from "../screens/Settings/Settings";
import ChatStack from "./ChatStack";
import { AppStackParamList } from "../types/Navigations";

const Tab = createBottomTabNavigator<AppStackParamList>();

const AppStack = () => {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerStyle: { backgroundColor: '#7766dd', height: 80 },
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName: keyof typeof Ionicons.glyphMap;

                    if (route.name === 'Deals') {
                        iconName = focused ? 'pricetags' : 'pricetags-outline';
                    } else if (route.name === 'GroupBuys') {
                        iconName = focused ? 'people' : 'people-outline';
                    } else if (route.name === 'Chats') {
                        iconName = focused ? 'chatbubble' : 'chatbubble-outline';
                    } else {
                        iconName = focused ? 'settings' : 'settings-outline';
                    }

                    return <Ionicons name={iconName} size={size} color={color} />;
                },
                tabBarActiveTintColor: '#7766dd',
                tabBarInactiveTintColor: 'gray',
            })}
        >
            <Tab.Screen name='Deals' component={DealsStack}></Tab.Screen>
            <Tab.Screen name='GroupBuys' component={GroupBuys} />
            <Tab.Screen name='Chats' component={ChatStack} options={{ headerShown: false }} />
            <Tab.Screen name='Settings' component={Settings} />
        </Tab.Navigator>
    );
};

export default AppStack;