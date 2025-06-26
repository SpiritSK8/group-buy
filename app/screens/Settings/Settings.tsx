import { View, Text, TextInput, Image, ActivityIndicator, Alert, TouchableOpacity } from 'react-native';
import React, { useState, useEffect, useRef } from 'react';
import { AntDesign } from '@expo/vector-icons';

import * as ImagePicker from 'expo-image-picker';

import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { database, storage } from '../../firebaseConfig';

import { useAuth } from '../../context/AuthContext';
import UserServices from '../../services/UserServices';


const Settings = () => {
    const [displayName, setDisplayName] = useState('');
    const [photoURL, setPhotoURL] = useState('');
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
            setLoading(false);
        };

        fetchUserData();
    }, [uid]);

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

            <TouchableOpacity onPress={handleSave} className="w-80 bg-blue-500 py-3 px-6 rounded-xl mt-10">
                <Text className="text-l text-white text-center font-medium">Save Changes</Text>
            </TouchableOpacity>

            <TouchableOpacity className="w-80 bg-red-500 py-3 px-6 rounded-xl mt-4" onPress={onLogout}>
                <Text className='text-l text-white text-center font-medium'>Sign Out</Text>
            </TouchableOpacity>
        </View>
    );
};

export default Settings;
