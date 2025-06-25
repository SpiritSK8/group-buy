import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Deals from '../screens/Deals/Deals';
import DealContributionForm from '../screens/Deals/DealContributionForm';
import { DealStackParamList } from '../types/Navigations';

const Stack = createNativeStackNavigator<DealStackParamList>();

const DealsStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="DealsHome" component={Deals} options={{ title: "Deals" }} />
      <Stack.Screen name="DealContributionForm" component={DealContributionForm} options={{ title: "Contribute to Deal" }} />
    </Stack.Navigator>
  );
};

export default DealsStack;
