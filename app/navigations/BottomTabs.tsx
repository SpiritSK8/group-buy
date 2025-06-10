import React from "react";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Button } from "react-native";

import { useAuth } from "../context/AuthContext";

import Deals from "../screens/(tabs)/Deals";
import Chats from "../screens/(tabs)/Chats";
import GroupBuys from "../screens/(tabs)/GroupBuys";
import Settings from "../screens/(tabs)/Settings";

export type bottomTabsTypes = {
    Deals: any;
    GroupBuys: any;
    Chats: any;
    Settings: any;
}

const Tab = createBottomTabNavigator<bottomTabsTypes>();

const BottomTabs = () => {
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

export default BottomTabs