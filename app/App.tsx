import { NavigationContainer } from '@react-navigation/native';

import { AuthProvider, useAuth } from './context/AuthContext';
import AuthStack from './navigations/AuthStack';
import AppStack from './navigations/AppStack';

import "./global.css";
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function App() {
    return (
        <SafeAreaProvider>
            <AuthProvider>
                <NavigationContainer>
                    <RootNavigator />
                </NavigationContainer>
            </AuthProvider>
        </SafeAreaProvider>
    );
}

const RootNavigator = () => {
    const { user } = useAuth();

    return user ? <AppStack /> : <AuthStack />;
};