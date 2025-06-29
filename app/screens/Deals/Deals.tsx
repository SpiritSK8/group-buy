import React from 'react';
import { Text, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { Deal } from '../../types/Deal';
import { calculateSavings } from '../../utils/calculateSavings';
import { DealCard } from './components/DealCard';
import { MOCK_DEALS } from './test/DealsTest';
import { DealsHomeNavigationProp } from '../../types/Navigations';

const Deals = ({ navigation }: { navigation: DealsHomeNavigationProp }) => {
    const mockDeals: Deal[] = MOCK_DEALS

    const topSavingsDeals = [...mockDeals].sort(
        (a, b) => calculateSavings(b) - calculateSavings(a)
    );

    return (
        <ScrollView className="bg-gray-100 p-4">
            <Text className="text-2xl font-bold mt-6 mb-2">💰 Top Savings</Text>

            {topSavingsDeals.map(deal => (
                <DealCard key={deal.dealID} deal={deal} onPress={() => navigation.navigate('DealContributionForm', { deal })} />
            ))}
        </ScrollView>
    );
};

export default Deals;
