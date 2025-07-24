import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { Deal } from './Deal';

// ---------------- AppStack ----------------
export type AppStackParamList = {
    Deals: undefined,
    GroupBuys: undefined;
    Chats: undefined;
    Settings: undefined;
};

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
    Chat: { chatRoomID: string };
    GroupBuySummary: { groupBuyID: string };
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

export type GroupBuySummaryNavigationProp = NativeStackNavigationProp<
    ChatStackParamList,
    'GroupBuySummary'
>;

export type GroupBuySummaryRouteProp = RouteProp<ChatStackParamList, 'GroupBuySummary'>;

// ---------------- DealStack ----------------
export type DealStackParamList = {
    DealsHome: undefined,
    NewDealForm: undefined; 
    DealContributionForm: { deal: Deal };
}

export type DealsHomeNavigationProp = NativeStackNavigationProp<
    DealStackParamList,
    'DealsHome'
>;

export type DealContributionFormNavigationProp = NativeStackNavigationProp<
    DealStackParamList,
    'DealContributionForm'
>;

export type DealContributionFormRouteProp = RouteProp<
    DealStackParamList,
    'DealContributionForm'
>;

// ---------------- GroupBuyStack ----------------
export type GroupBuyStackParamList = {
    GroupBuyList: undefined,
    GroupBuy: { groupBuyID: string };
}

export type GroupBuyListNavigationProp = NativeStackNavigationProp<
    GroupBuyStackParamList,
    'GroupBuyList'
>;

export type GroupBuyNavigationProp = NativeStackNavigationProp<
    GroupBuyStackParamList,
    'GroupBuy'
>;

export type GroupBuyRouteProp = RouteProp<
    GroupBuyStackParamList,
    'GroupBuy'
>;

// ---------------- Settings ----------------

export type SettingsNavigationProp = NativeStackNavigationProp<
    AppStackParamList,
    'Settings'
>;