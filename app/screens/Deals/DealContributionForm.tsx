import React, { useState } from 'react';
import { View, Text, TextInput, Button } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

import { DealContributionFormNavigationProp, DealContributionFormRouteProp } from '../../types/Navigations';

const DealContributionForm = ({ navigation, route }: { navigation: DealContributionFormNavigationProp, route: DealContributionFormRouteProp }) => {
    const { deal } = route.params;

    const [itemsContributed, setItemsContributed] = useState('');
    const [purchaseDate, setPurchaseDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [timeRange, setTimeRange] = useState('');
    const [location, setLocation] = useState('');

    return (
        <View className="p-4">
            <Text className="text-xl font-bold mb-4">{deal.dealName}</Text>

            <Text>Number of items you're contributing:</Text>
            <TextInput
                className="border p-2 mb-3"
                keyboardType="numeric"
                value={itemsContributed}
                onChangeText={setItemsContributed}
            />

            <Text>Ideal Date of Purchase:</Text>
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
            )}

            <Text className="mt-4">Preferred Time Range:</Text>
            <TextInput
                className="border p-2 mb-3"
                placeholder="e.g. 2–4 PM"
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

            <Button title="Submit" onPress={() => {
                // Do something with data here (e.g., save or send to backend)
                navigation.goBack();
            }} />
        </View>
    );
};

export default DealContributionForm;
