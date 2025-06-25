import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Login from "../screens/Login";
import Register from "../screens/Register";
import { AuthStackParamList } from "../types/Navigations";

const Stack = createNativeStackNavigator<AuthStackParamList>();

const AuthStack = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="Register" component={Register} />
        </Stack.Navigator>
    );
};

export default AuthStack;