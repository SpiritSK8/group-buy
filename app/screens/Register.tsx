import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigation } from '@react-navigation/native';
import { FirebaseError } from 'firebase/app';

const Register = () => {
    const navigation = useNavigation<any>();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const { onRegister } = useAuth();

    async function register() {
        setIsLoading(true);
        try {
            await onRegister!(email, password);
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
                    case 'auth/email-already-in-use':
                        msg = "This email is already in use.";
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
            <Text style={styles.title}>Register</Text>

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
                autoCapitalize="none"
                style={styles.input}
                secureTextEntry
            />

            <View style={{ marginTop: 16 }}>
                <Button title={isLoading ? 'Loading...' : 'Register'} onPress={isLoading ? () => {} : register} />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, justifyContent: 'center' },
    input: { borderWidth: 1, padding: 10, marginVertical: 10, borderRadius: 5 },
    title: { fontSize: 24, marginBottom: 20, textAlign: 'center' },
    button: { marginVertical: 10 },
});

export default Register;