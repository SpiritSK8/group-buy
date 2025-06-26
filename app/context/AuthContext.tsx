import { createContext, useContext, useEffect, useState } from 'react';

import { getAuth, User } from 'firebase/auth';

import FirebaseServices from '../services/FirebaseServices';

interface AuthProps {
    user: User | null;
    onRegister?: (displayName: string, email: string, password: string) => Promise<User>;
    onLogin?: (email: string, password: string) => Promise<User>;
    onLogout?: () => Promise<any>;
}

const AuthContext = createContext<AuthProps>({ user: null });

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
    }, []);

    async function register(displayName: string, email: string, password: string) {
        const user = await FirebaseServices.register(displayName, email, password);
        setUser(user);
        return user;
    }

    async function login(email: string, password: string) {
        const user = await FirebaseServices.login(email, password);
        setUser(user);
        return user;
    }

    async function logout() {
        await FirebaseServices.logout();
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