import { createContext, useContext, useEffect, useState } from 'react';

import { auth } from '../firebaseConfig';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, UserCredential } from 'firebase/auth';

interface AuthProps {
    user?: UserCredential | null;
    onRegister?: (email: string, password: string) => Promise<UserCredential>;
    onLogin?: (email: string, password: string) => Promise<UserCredential>;
    onLogout?: () => Promise<any>;
}

const AuthContext = createContext<AuthProps>({});

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }: any) => {
    const [user, setUser] = useState<UserCredential | null>(null);

    useEffect(() => {
        // TODO: Check if user has already been logged in.
    }, []);

    async function register(email: string, password: string) {
        const user = await createUserWithEmailAndPassword(auth, email, password);
        setUser(user);
        // TODO: Store token in persistent storage.
        return user;
    }

    async function login(email: string, password: string) {
        const user = await signInWithEmailAndPassword(auth, email, password);
        setUser(user);
        // TODO: Store token in persistent storage.
        return user;
    }

    async function logout() {
        // TODO: Delete token from persistent storage.

        await signOut(auth);

        setUser(null);
    }

    const value = {
        user,
        onRegister: register,
        onLogin: login,
        onLogout: logout
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};