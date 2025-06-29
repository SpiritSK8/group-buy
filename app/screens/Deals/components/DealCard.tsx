import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity } from "react-native";

import { Deal } from '../../../types/Deal';
import { calculateSavings } from '../../../utils/calculateSavings';

export const DealCard = ({ deal, onPress }: { deal: Deal, onPress: () => void }) => {
    return (
        <TouchableOpacity
            onPress={onPress}
        >
            <View className="bg-white rounded-xl p-4 mb-4 shadow">
                <Text className="text-xl font-bold">{deal.dealName}</Text>
                <Text className="text-sm text-gray-600">{deal.itemName}</Text>

                <Text className="text-green-700 font-semibold">
                    Save {calculateSavings(deal).toLocaleString()} SGD
                </Text>

                {deal.itemOrigPrice && (
                    <Text className="text-sm text-gray-500 line-through">
                        {deal.itemOrigPrice.toLocaleString()} SGD
                    </Text>
                )}

                <Text className="text-sm text-blue-500">
                    📍 {deal.dealStore}
                </Text>
            </View>
        </TouchableOpacity>
    );
};