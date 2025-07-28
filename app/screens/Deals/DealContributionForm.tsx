import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

import { DealContributionFormNavigationProp, DealContributionFormRouteProp } from '../../types/Navigations';
import GroupBuyServices from '../../services/GroupBuyServices';
import { useAuth } from '../../context/AuthContext';

const DealContributionForm = ({ navigation, route }: { navigation: DealContributionFormNavigationProp, route: DealContributionFormRouteProp }) => {
    const { deal } = route.params;

    const { user } = useAuth();

    const [itemsContributed, setItemsContributed] = useState('');
    const [purchaseDate, setPurchaseDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [timeRange, setTimeRange] = useState('');
    const [location, setLocation] = useState('');

    if (!user?.uid) {
        return (
            <View className="justify-center items-center">
                <Text>You must be logged in to join a GroupBuy.</Text>
            </View>
        );
    }

    const onChanged = (text: string) => {
        text = text.replace(/\D/g, ""); // Deletes non-digit characters.
        setItemsContributed(text);
    }

    const handleSubmit = () => {
        if (!itemsContributed || !purchaseDate || !timeRange || !location) {
            Alert.alert('Error', 'Please fill in all fields.');
            return;
        }

        if (purchaseDate < new Date()) {
            Alert.alert('Error', 'Date of purchase must be in the future.');
            return;
        }

        GroupBuyServices.createAndJoinGroupBuy(user.uid, deal.dealID, parseInt(itemsContributed), purchaseDate);
        navigation.goBack();
    };

    return (
        <View className="p-4">
            <Text className="text-xl font-bold mb-4">{deal.dealName}</Text>

            <Text>Number of items you're contributing:</Text>
            <TextInput
                className="border p-2 mb-3"
                keyboardType="numeric"
                value={itemsContributed}
                onChangeText={onChanged}
            />

            <Text>Ideal Date of Purchase:</Text>
            <Button title={purchaseDate.toDateString()} onPress={() => setShowDatePicker(true)} />
            {showDatePicker && (
                <DateTimePicker
                    value={purchaseDate}
                    mode="date"
                    display="default"
                    minimumDate={new Date()}
                    onChange={(_, date) => {
                        setShowDatePicker(false);
                        if (date) setPurchaseDate(date);
                    }}
                />
            )}

            <Text className="mt-4">Preferred Time Range:</Text>
            <TextInput
                className="border p-2 mb-3"
                placeholder="e.g. 2-4 PM"
                value={timeRange}
                onChangeText={setTimeRange}
            />

            <Text>Preferred Meetup Location:</Text>
            <TextInput
                className="border p-2 mb-6"
                placeholder="e.g. Clementi MRT"
                value={location}
                onChangeText={setLocation}
            />

            <Button title="Submit" onPress={handleSubmit} />
        </View>
    );
};

export default DealContributionForm;
