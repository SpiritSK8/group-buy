import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { AuthProvider, useAuth } from './context/AuthContext';
import AuthStack from './navigations/AuthStack';
import AppStack from './navigations/AppStack';

import "./global.css";

export default function App() {
    return (
        <AuthProvider>
            <NavigationContainer>
                <RootNavigator />
            </NavigationContainer>
        </AuthProvider>
    );
}

const RootNavigator = () => {
    const { user } = useAuth();

    return user ? <AppStack /> : <AuthStack />;
};