
import React, { useState } from 'react';
import { ScrollView, View, Text, TextInput, Button, StyleSheet, Alert, Platform } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import type { DealStackParamList } from '../../types/Navigations';
import DealsServices from '../../services/DealsServices';

// Navigation prop for this screen
type NewDealFormNavProp = NativeStackNavigationProp<DealStackParamList, 'NewDealForm'>;

const NewDealForm: React.FC = () => {
    const navigation = useNavigation<NewDealFormNavProp>();

    // Common fields
    const [dealName, setDealName] = useState('');
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [expiryDate, setExpiryDate] = useState<Date | null>(null);
    const [showStartDatePicker, setShowStartDatePicker] = useState(false);
    const [showExpiryDatePicker, setShowExpiryDatePicker] = useState(false);
    const [dealStore, setDealStore] = useState('');
    const [dealUrl, setDealUrl] = useState('');
    const [itemName, setItemName] = useState('');
    const [itemOrigPrice, setItemOrigPrice] = useState('');

    // Deal type and subtype-specific fields
    const [dealType, setDealType] = useState<'buyXGetY' | 'minItemPurchase' | 'packageDeal'>('buyXGetY');
    const [itemReq, setItemReq] = useState('');
    const [itemFree, setItemFree] = useState('');
    const [minPurchase, setMinPurchase] = useState('');
    const [discount, setDiscount] = useState('');
    const [itemQuantityReq, setItemQuantityReq] = useState('');
    const [itemTotalPrice, setItemTotalPrice] = useState('');

    const [submitting, setSubmitting] = useState(false);

    const onStartDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
        setShowStartDatePicker(Platform.OS === 'ios'); // on iOS, the picker can be persistent
        if (event.type === 'set' && selectedDate) {
            setShowStartDatePicker(false);
            setStartDate(selectedDate);
            if (expiryDate && selectedDate > expiryDate) {
                setExpiryDate(null); // Reset expiry if it's before the new start date
            }
        } else {
            setShowStartDatePicker(false);
        }
    };

    const onExpiryDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
        setShowExpiryDatePicker(false);
        if (event.type === 'set' && selectedDate) {
            setExpiryDate(selectedDate);
        }
    };

    const handleSubmit = async () => {
        // Validate fields
        if (!dealName || !startDate || !expiryDate || !dealStore || !dealUrl || !itemName || !itemOrigPrice) {
            Alert.alert('Error', 'Please fill in all fields, including dates.');
            return;
        }
        const origPrice = parseFloat(itemOrigPrice);
        if (isNaN(origPrice)) {
            Alert.alert('Error', 'Original price must be a valid number');
            return;
        }

        // Build payload
        const payload: any = {
            dealName,
            dealStart: startDate.toISOString().split('T')[0],
            dealExpiry: expiryDate.toISOString().split('T')[0],
            dealStore,
            dealUrl,
            isActive: true,
            itemName,
            itemOrigPrice: origPrice,
            dealType,
        };

        // Add subtype fields
        if (dealType === 'buyXGetY') {
            const req = parseInt(itemReq, 10);
            const free = parseInt(itemFree, 10);
            if (isNaN(req) || isNaN(free)) {
                Alert.alert('Error', 'Enter valid numbers for Buy X Get Y');
                return;
            }
            payload.itemReq = req;
            payload.itemFree = free;
        } else if (dealType === 'minItemPurchase') {
            const min = parseInt(minPurchase, 10);
            const disc = parseFloat(discount);
            if (isNaN(min) || isNaN(disc)) {
                Alert.alert('Error', 'Enter valid numbers for Min Item Purchase');
                return;
            }
            payload.minPurchase = min;
            payload.discount = disc;
            payload.totalItems = min;
        } else {
            const qty = parseInt(itemQuantityReq, 10);
            const tot = parseFloat(itemTotalPrice);
            if (isNaN(qty) || isNaN(tot)) {
                Alert.alert('Error', 'Enter valid numbers for Package Deal');
                return;
            }
            payload.itemQuantityReq = qty;
            payload.itemTotalPrice = tot;
        }

        setSubmitting(true);
        try {
            await DealsServices.createDeal(payload);
            Alert.alert('Success', 'Deal created successfully');
            navigation.goBack();
        } catch (err: any) {
            console.error(err);
            Alert.alert('Error', err.message);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            {/* Common fields */}
            <Text style={styles.label}>Deal Name</Text>
            <TextInput style={styles.input} value={dealName} onChangeText={setDealName} />

            <Text style={styles.label}>Deal Start</Text>
            <Button onPress={() => setShowStartDatePicker(true)} title={startDate ? startDate.toLocaleDateString() : 'Select Start Date'} />
            {showStartDatePicker && (
                <DateTimePicker
                    value={startDate || new Date()}
                    mode="date"
                    display="default"
                    onChange={onStartDateChange}
                />
            )}

            <Text style={styles.label}>Deal Expiry</Text>
            <Button onPress={() => setShowExpiryDatePicker(true)} title={expiryDate ? expiryDate.toLocaleDateString() : 'Select Expiry Date'} />
            {showExpiryDatePicker && (
                <DateTimePicker
                    value={expiryDate || startDate || new Date()}
                    mode="date"
                    display="default"
                    onChange={onExpiryDateChange}
                    minimumDate={startDate || undefined}
                />
            )}

            <Text style={styles.label}>Deal Store</Text>
            <TextInput style={styles.input} value={dealStore} onChangeText={setDealStore} />

            <Text style={styles.label}>Deal URL</Text>
            <TextInput style={styles.input} value={dealUrl} onChangeText={setDealUrl} keyboardType="url" autoCapitalize="none" />

            <Text style={styles.label}>Item Name</Text>
            <TextInput style={styles.input} value={itemName} onChangeText={setItemName} />

            <Text style={styles.label}>Item Original Price</Text>
            <TextInput
                style={styles.input}
                value={itemOrigPrice}
                onChangeText={setItemOrigPrice}
                keyboardType="decimal-pad"
            />

            {/* Deal type selector */}
            <Text style={styles.label}>Deal Type</Text>
            <Picker
                selectedValue={dealType}
                onValueChange={(value) => setDealType(value)}
                style={styles.picker}
            >
                <Picker.Item label="Buy X Get Y Free" value="buyXGetY" />
                <Picker.Item label="Min Item Purchase" value="minItemPurchase" />
                <Picker.Item label="Package Deal" value="packageDeal" />
            </Picker>

            {/* Subtype-specific fields */}
            {dealType === 'buyXGetY' && (
                <>
                    <Text style={styles.label}>How many to buy?</Text>
                    <TextInput
                        style={styles.input}
                        value={itemReq}
                        onChangeText={setItemReq}
                        keyboardType="number-pad"
                    />
                    <Text style={styles.label}>How many free?</Text>
                    <TextInput
                        style={styles.input}
                        value={itemFree}
                        onChangeText={setItemFree}
                        keyboardType="number-pad"
                    />
                </>
            )}
            {dealType === 'minItemPurchase' && (
                <>
                    <Text style={styles.label}>Minimum items to purchase</Text>
                    <TextInput
                        style={styles.input}
                        value={minPurchase}
                        onChangeText={setMinPurchase}
                        keyboardType="number-pad"
                    />
                    <Text style={styles.label}>Discount (%)</Text>
                    <TextInput
                        style={styles.input}
                        value={discount}
                        onChangeText={setDiscount}
                        keyboardType="decimal-pad"
                    />
                </>
            )}
            {dealType === 'packageDeal' && (
                <>
                    <Text style={styles.label}>Items needed to buy</Text>
                    <TextInput
                        style={styles.input}
                        value={itemQuantityReq}
                        onChangeText={setItemQuantityReq}
                        keyboardType="number-pad"
                    />
                    <Text style={styles.label}>Total price</Text>
                    <TextInput
                        style={styles.input}
                        value={itemTotalPrice}
                        onChangeText={setItemTotalPrice}
                        keyboardType="decimal-pad"
                    />
                </>
            )}

            <View style={styles.buttonContainer}>
                <Button
                    title={submitting ? 'Submitting...' : 'Submit'}
                    onPress={handleSubmit}
                    disabled={submitting}
                />
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 16,
        backgroundColor: '#fff',
    },
    label: {
        marginTop: 12,
        fontWeight: '600',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 4,
        padding: 8,
        marginTop: 4,
    },
    picker: {
        marginTop: 4,
    },
    buttonContainer: {
        marginTop: 24,
    },
});

export default NewDealForm;
