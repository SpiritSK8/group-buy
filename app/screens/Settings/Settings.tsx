import { View, Text, TextInput, Image, ActivityIndicator, Alert, TouchableOpacity } from 'react-native';
import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { AntDesign } from '@expo/vector-icons';

import * as ImagePicker from 'expo-image-picker';

import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { database, storage } from '../../firebaseConfig';

import { useAuth } from '../../context/AuthContext';
import UserServices from '../../services/UserServices';
import { Colors } from '../../constants/Colors';
import { SettingsNavigationProp } from '../../types/Navigations';

type Props = {
    navigation: SettingsNavigationProp
};

const Settings = ({ navigation }: Props) => {
    const [displayName, setDisplayName] = useState('');
    const [prevDisplayName, setPrevDisplayName] = useState('');
    const [photoURL, setPhotoURL] = useState('');
    const [prevPhotoURL, setPrevPhotoURL] = useState('');
    const [settingsChanged, setSettingsChanged] = useState(false);

    const [imageUploading, setImageUploading] = useState(false);
    const [loading, setLoading] = useState(true);

    const { user, onLogout } = useAuth();
    const uid = user?.uid;

    const displayNameInputRef = useRef<TextInput>(null);

    useEffect(() => {
        const fetchUserData = async () => {
            if (!uid) return;
            setDisplayName(await UserServices.getUserDisplayName(uid) || '');
            setPhotoURL(await UserServices.getUserPhotoURL(uid) || '')
            setPrevDisplayName(displayName);
            setPrevPhotoURL(photoURL);
            setLoading(false);
        };

        fetchUserData();
    }, [uid]);

    useEffect(() => {
        setSettingsChanged(displayName !== prevDisplayName || photoURL !== prevPhotoURL);
    }, [displayName, photoURL, prevDisplayName, prevPhotoURL]);

    useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () =>
                <TouchableOpacity
                    onPress={onLogout}
                    className="w-30 py-2 px-6 mr-2 rounded-xl"
                    style={{ backgroundColor: Colors.error }}
                >
                    <Text className='text-l text-white text-center font-medium'>Sign Out</Text>
                </TouchableOpacity>
        });
    });

    const pickImage = async () => {
        try {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                quality: 1.0,
            });

            if (!result.canceled) {
                setImageUploading(true);
                const img = result.assets[0];
                const response = await fetch(img.uri);
                const blob = await response.blob();

                const imageRef = ref(storage, `profile_pictures/${uid}.jpg`);
                await uploadBytes(imageRef, blob);
                const downloadURL = await getDownloadURL(imageRef);

                setPhotoURL(downloadURL);
            }
        } catch (error: any) {
            Alert.alert('Image upload failed', error.message);
        } finally {
            setImageUploading(false);
        }
    };

    const handleSave = async () => {
        if (!uid) return;
        try {
            await setDoc(doc(database, 'users', uid), {
                displayName,
                photoURL,
            }, { merge: true });
            setPrevDisplayName(displayName);
            setPrevPhotoURL(photoURL);
            Alert.alert('Success', 'Profile updated.');
        } catch (error) {
            Alert.alert('Error', 'Failed to update profile.');
            console.error(error);
        }
    };

    if (loading) return (
        <View className='flex-1 justify-center align-middle'>
            <ActivityIndicator size="large" className="mt-10" />
        </View>
    );

    return (
        <View className="flex-1 bg-white px-5 pt-24 items-center">
            {imageUploading ? (
                <ActivityIndicator />
            ) : (
                <TouchableOpacity onPress={pickImage}>
                    {photoURL ? (
                        <Image source={{ uri: photoURL }} className="w-32 h-32 rounded-full mb-3" />
                    ) : (
                        <View className="w-32 h-32 rounded-full bg-gray-300 mb-3" />
                    )}
                </TouchableOpacity>
            )}

            <View className='flex-row items-baseline'>
                <TextInput
                    ref={displayNameInputRef}
                    className="text-4xl font-semibold mr-1"
                    value={displayName}
                    onChangeText={setDisplayName}
                    placeholder="Enter your name"
                />
                <TouchableOpacity onPress={() => displayNameInputRef.current?.focus()}>
                    <AntDesign name="edit" size={24} color="#4F8EF7" />
                </TouchableOpacity>
            </View>

            <Text className='font-light text-xl'>{user?.email}</Text>

            {settingsChanged && <TouchableOpacity
                onPress={handleSave}
                className="w-80 py-3 px-6 rounded-xl mt-10"
                style={{ backgroundColor: Colors.primary }}
            >
                <Text className="text-l text-white text-center font-medium">Save Changes</Text>
            </TouchableOpacity>}

        </View>
    );
};

export default Settings;
