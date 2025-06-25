import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RouteProp } from "@react-navigation/native";

// ---------------- AuthStack ----------------
export type AuthStackParamList = {
  Login: undefined,
  Register: undefined;
};

export type LoginNavigationProp = NativeStackNavigationProp<
    AuthStackParamList,
    'Login'
>;

export type RegisterNavigationProp = NativeStackNavigationProp<
    AuthStackParamList,
    'Register'
>;

// ---------------- ChatStack ----------------
export type ChatStackParamList = {
  ChatList: undefined,
  Chat: { uid: string }; 
};

export type ChatListNavigationProp = NativeStackNavigationProp<
    ChatStackParamList,
    'ChatList'
>;

export type ChatNavigationProp = NativeStackNavigationProp<
    ChatStackParamList,
    'Chat'
>;

export type ChatRouteProp = RouteProp<ChatStackParamList, 'Chat'>;