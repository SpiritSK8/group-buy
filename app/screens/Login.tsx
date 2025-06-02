import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext';
import { useNavigation } from '@react-navigation/native';

const Login = () => {
    const navigation = useNavigation<any>();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { onLogin } = useAuth();

    const login = async () => {
        const result = await onLogin!(email, password);
        if (result && result.error) {
            alert(result.msg);
            return;
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
                style={styles.input}
                secureTextEntry
            />

            <View style={{ marginTop: 16 }}>
                <Button title="Login" onPress={login} />
            </View>

            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                <Text style={{ color: 'blue', marginTop: 16, textAlign: 'center' }}>
                    Don't have an account? Register here
                </Text>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, justifyContent: 'center' },
    input: { borderWidth: 1, padding: 10, marginVertical: 10, borderRadius: 5 },
    title: { fontSize: 24, marginBottom: 20, textAlign: 'center' },
    button: { marginVertical: 10 },
});

export default Login