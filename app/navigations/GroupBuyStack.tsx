import { createNativeStackNavigator } from '@react-navigation/native-stack';

import React from 'react';

import GroupBuyList from '../screens/GroupBuy/GroupBuyList';
import GroupBuy from '../screens/GroupBuy/GroupBuy';
import { GroupBuyStackParamList } from '../types/Navigations';
import { Colors } from '../constants/Colors';

const Stack = createNativeStackNavigator<GroupBuyStackParamList>();

const GroupBuyStack = () => {
    return (
        <Stack.Navigator
            initialRouteName="GroupBuyList"
            screenOptions={{
                headerShown: true,
                title: 'Browse GroupBuys',
                headerStyle: {backgroundColor: Colors.primary}
        }}>
            <Stack.Screen name="GroupBuyList" component={GroupBuyList} />
            <Stack.Screen name="GroupBuy" component={GroupBuy} />
        </Stack.Navigator>
    )
}

export default GroupBuyStack;