import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Deals from '../screens/Deals/Deals';
import DealContributionForm from '../screens/Deals/DealContributionForm';
import NewDealForm from '../screens/Deals/NewDealForm';
import { DealStackParamList } from '../types/Navigations';
import { Colors } from '../constants/Colors';

const Stack = createNativeStackNavigator<DealStackParamList>();

const DealsStack = () => {
    return (
        <Stack.Navigator
            initialRouteName="DealsHome"
            screenOptions={{
                headerShown: true,
                title: 'Chat',
                headerStyle: { backgroundColor: Colors.primary }
            }}
        >
            <Stack.Screen name="DealsHome" component={Deals} options={{ title: 'Deals' }} />
            <Stack.Screen name="DealContributionForm" component={DealContributionForm} options={{ title: 'Contribute to Deal' }} />
            <Stack.Screen name="NewDealForm" component={NewDealForm} />
        </Stack.Navigator>
    );
};

export default DealsStack;
