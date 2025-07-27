import { View, Text, TextInput, Button, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
import React, { useCallback, useEffect, useLayoutEffect, useState } from 'react';

import { GroupBuyNavigationProp, GroupBuyRouteProp } from '../../types/Navigations';
import { useAuth } from '../../context/AuthContext';
import GroupBuyServices from '../../services/GroupBuyServices';
import { Deal } from '../../types/Deal';
import DealsServices from '../../services/DealsServices';
import { Colors } from '../../constants/Colors';

type Props = {
    navigation: GroupBuyNavigationProp;
    route: GroupBuyRouteProp;
}

const GroupBuy = ({ navigation, route }: Props) => {
    const { user } = useAuth();

    const [deal, setDeal] = useState<Deal | null>(null);

    const [itemsContributed, setItemsContributed] = useState('');
    const [purchaseDate, setPurchaseDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [timeRange, setTimeRange] = useState('');
    const [location, setLocation] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [hasJoined, setHasJoined] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useLayoutEffect(() => {
        navigation.setOptions({ title: "Join GroupBuy" });
    });

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            const fetchedGroupBuy = await GroupBuyServices.fetchGroupBuy(route.params.groupBuyID);
            if (!fetchedGroupBuy) {
                setIsLoading(false);
                return;
            }

            if (user?.uid) {
                const isUserIn = await GroupBuyServices.isUserInGroupBuy(user.uid, fetchedGroupBuy.id);
                setHasJoined(isUserIn);
            }

            const fetchedDeal = await DealsServices.fetchDeal(fetchedGroupBuy.dealID);

            setDeal(fetchedDeal);
            setIsLoading(false);
        }

        fetchData();
    }, []);

    const onChanged = (text: string) => {
        text = text.replace(/\D/g, ""); // Deletes non-digit characters.
        setItemsContributed(text);
    }

    const onSubmit = async (uid: string) => {
        setIsSubmitting(true);

        // Validate fields
        if (!itemsContributed) {
            Alert.alert('Error', 'Please fill in how many items you want to buy.');
            setIsSubmitting(false);
            return;
        }

        await GroupBuyServices.joinGroupBuy(uid, route.params.groupBuyID, parseInt(itemsContributed));
        Alert.alert("Success", "Check your newly joined GroupBuy in Chats!");
        navigation.goBack();
    };

    if (!user?.uid) {
        return (
            <View className="flex-1 justify-center items-center">
                <Text>You must be logged in to join a GroupBuy.</Text>
            </View>
        );
    }

    if (hasJoined) {
        return (
            <View className="flex-1 justify-center items-center">
                <Text>You have successfully joined this GroupBuy.</Text>
            </View>
        );
    }

    if (isLoading || !deal) {
        return (
            <View className="flex-1 justify-center items-center" style={{ backgroundColor: Colors.light.background }}>
                <ActivityIndicator />
            </View>
        );
    }

    return (
        <View className="p-4">
            <Text className="text-xl font-bold mb-4">{deal.dealName}</Text>

            <Text>Number of items you're contributing:</Text>
            <TextInput
                className="border p-2 mb-3 rounded-xl"
                keyboardType="numeric"
                value={itemsContributed}
                onChangeText={onChanged}
            />

            {/* <Text>Ideal Date of Purchase:</Text>
            <Button title={purchaseDate.toDateString()} onPress={() => setShowDatePicker(true)} />
            {showDatePicker && (
                <DateTimePicker
                    value={purchaseDate}
                    mode="date"
                    display="default"
                    onChange={(_, date) => {
                        setShowDatePicker(false);
                        if (date) setPurchaseDate(date);
                    }}
                />
            )} */}

            <Text className="mt-4">Preferred Time Range:</Text>
            <TextInput
                className="border p-2 mb-3 rounded-xl"
                placeholder="e.g. 2-4 PM"
                value={timeRange}
                onChangeText={setTimeRange}
            />

            <Text>Preferred Meetup Location:</Text>
            <TextInput
                className="border p-2 mb-6 rounded-xl"
                placeholder="e.g. Clementi MRT"
                value={location}
                onChangeText={setLocation}
            />

            {isSubmitting ?
                <View className="w-full p-3 rounded-xl items-center bg-gray-400">
                    <Text className="text-l text-white">Joining GroupBuy...</Text>
                </View>
                :
                <TouchableOpacity className="w-full p-3 rounded-xl items-center bg-blue-400" onPress={() => onSubmit(user.uid)}>
                    <Text>Submit</Text>
                </TouchableOpacity>
            }
        </View>
    );
};

export default GroupBuy;