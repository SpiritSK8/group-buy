import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { FirebaseError } from 'firebase/app';

import { useAuth } from '../context/AuthContext';
import { LoginNavigationProp } from '../types/Navigations';

type Props = {
    navigation: LoginNavigationProp;
}

const Login = ({navigation}: Props) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const { onLogin } = useAuth();

    async function login() {
        setIsLoading(true);
        try {
            await onLogin!(email, password);
        } catch (error: any) {
            let msg = error.message;
            if (error instanceof FirebaseError) {
                console.log(error.code);
                switch (error.code) {
                    case 'auth/invalid-email':
                        msg = "Invalid email.";
                        break;
                    case 'auth/missing-password':
                        msg = "Please provide a password.";
                        break;
                    case 'auth/invalid-credential':
                        msg = "Incorrect password.";
                        break;
                }
            }
            alert(msg);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Login</Text>

            <Text>Email</Text>
            <TextInput
                value={email}
                onChangeText={setEmail}
                style={styles.input}
                autoCapitalize="none"
                keyboardType="email-address"
            />

            <Text>Password</Text>
            <TextInput
                value={password}
                onChangeText={setPassword}
                autoCapitalize={'none'}
                style={styles.input}
                secureTextEntry
            />

            <View style={{ marginTop: 16 }}>
                <Button title={isLoading ? 'Loading...' : 'Login'} onPress={isLoading ? () => {} : login} />
            </View>

            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                <Text className='text-blue-500 mt-4 text-center'>
                    Don't have an account? Register here
                </Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, justifyContent: 'center' },
    input: { borderWidth: 1, padding: 10, marginVertical: 10, borderRadius: 5 },
    title: { fontSize: 24, marginBottom: 20, textAlign: 'center' },
    button: { marginVertical: 10 },
});

export default Login;