import { NavigationContainer } from '@react-navigation/native';

import { AuthProvider, useAuth } from './context/AuthContext';
import AuthStack from './navigations/AuthStack';
import AppStack from './navigations/AppStack';

import './global.css';

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

    // return (
    //     <Fragment>
    //         <SafeAreaView className='flex-0' style={{ backgroundColor: Colors.error }}></SafeAreaView>
    //         <SafeAreaView className='flex-1' style={{ backgroundColor: Colors.light.background }}>
    //             {user ? <AppStack /> : <AuthStack />}
    //         </SafeAreaView>
    //     </Fragment>
    // );
};