import { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

import { auth } from '../firebaseConfig';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, UserCredential } from 'firebase/auth';

interface AuthProps {
    user?: UserCredential | null;
    onRegister?: (email: string, password: string) => Promise<any>;
    onLogin?: (email: string, password: string) => Promise<any>;
    onLogout?: () => Promise<any>;
}

const TOKEN_KEY = 'my-jwt';
export const API_URL = 'http://10.0.2.2:3000'; // Only valid for Android emulators.

const AuthContext = createContext<AuthProps>({});

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }: any) => {
    const [user, setUser] = useState<UserCredential | null>(null);

    useEffect(() => {
        // TODO: Check if user has already been logged in.
    }, []);

    const register = async (email: string, password: string) => {
        try {
            const user = await createUserWithEmailAndPassword(auth, email, password);
            setUser(user);
            // TODO: Store token in persistent storage.
            return user;
        } catch (error: any) {
            return { error: true, message: error.message }
        }
    }

    const login = async (email: string, password: string) => {
        try {
            const user = await signInWithEmailAndPassword(auth, email, password);
            setUser(user);
            // TODO: Store token in persistent storage.
            return user;
        } catch (error: any) {
            return { error: true, message: error.message }
        }
    }

    const logout = async () => {
        // TODO: Delete token from persistent storage.

        await signOut(auth);

        setUser(null);
    }

    // const register = async (email: string, password: string) => {
    //     try {
    //         return await axios.post(`${API_URL}/users`, { email, password });
    //     } catch (e) {
    //         return { error: true, msg: (e as any).response.data.msg };
    //     }
    // };

    // const login = async (email: string, password: string) => {
    //     try {
    //         const result = await axios.post(`${API_URL}/auth`, { email, password });

    //         setAuthState({
    //             token: result.data.token,
    //             authenticated: true
    //         });

    //         axios.defaults.headers.common['Authorization'] = `Bearer ${result.data.token}`;

    //         await SecureStore.setItemAsync(TOKEN_KEY, result.data.token);

    //         return result;
    //     } catch (e) {
    //         return { error: true, msg: (e as any).response.data.msg };
    //     }
    // };

    // const logout = async () => {
    //     await SecureStore.deleteItemAsync(TOKEN_KEY);

    //     axios.defaults.headers.common['Authorization'] = '';

    //     setAuthState({
    //         token: null,
    //         authenticated: false
    //     });
    // }

    const value = {
        user,
        onRegister: register,
        onLogin: login,
        onLogout: logout
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}