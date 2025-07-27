import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity } from "react-native";

import { Deal } from '../../../types/Deal';
import { calculateSavings } from '../../../utils/calculateSavings';

export const DealCard = ({ deal, onPress }: { deal: Deal, onPress: () => void }) => {
    const dealName = deal.dealName;
    const itemName = deal.itemName;
    const originalPrice = deal.itemOrigPrice;
    const saved = calculateSavings(deal);
    const discountedPrice = originalPrice - saved;
    const store = deal.dealStore;

    return (
        <TouchableOpacity onPress={onPress}>
            <View className="bg-white rounded-xl p-4 mb-4 shadow">
                <View className="flex-row justify-between">
                    <View className="flex-row">
                        <View className="mr-2">
                            <Text className="text-xl font-extrabold">
                                ${discountedPrice.toLocaleString('en-US', {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2
                                })}
                            </Text>
                        </View>
                        <View>
                            <Text className="text-xl font-light text-gray-500 line-through">
                                ${deal.itemOrigPrice.toLocaleString('en-US', {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2
                                })}
                            </Text>
                        </View>
                    </View>
                </View>

                <View className="mb-3">
                    <Text className="text-xl">{itemName}</Text>
                </View>

                <Text className="text-sm text-blue-500">
                    📍 {store}
                </Text>

                <View className="bg-green-400 p-1 rounded-l absolute right-0 top-0">
                    <Text className="">
                        Save ${saved.toLocaleString('en-US', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2
                        })}
                    </Text>
                </View>
            </View >
        </TouchableOpacity >
    );
};