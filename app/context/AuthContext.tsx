import { createContext, useContext, useEffect, useState } from 'react';

import { auth } from '../firebaseConfig';
import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword, signOut, User } from 'firebase/auth';

interface AuthProps {
    user?: User | null;
    onRegister?: (email: string, password: string) => Promise<User>;
    onLogin?: (email: string, password: string) => Promise<User>;
    onLogout?: () => Promise<any>;
}

const AuthContext = createContext<AuthProps>({});

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }: any) => {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const unsubscribe = getAuth().onAuthStateChanged((user) => {
            console.log("Currently logged in as: " + user?.email);
            setUser(user);
        });
        return unsubscribe;
    });

    async function register(email: string, password: string) {
        const user = (await createUserWithEmailAndPassword(auth, email, password)).user;
        setUser(user);
        return user;
    }

    async function login(email: string, password: string) {
        const user = (await signInWithEmailAndPassword(auth, email, password)).user;
        setUser(user);
        return user;
    }

    async function logout() {
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