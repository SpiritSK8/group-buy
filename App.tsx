import { AuthProvider, useAuth } from './app/context/AuthContext';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AuthStack from './app/navigations/AuthStack';
import AppStack from './app/navigations/AppStack';

const Stack = createNativeStackNavigator();

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
    const { authState } = useAuth();

    return authState?.authenticated ? <AppStack /> : <AuthStack />;
};