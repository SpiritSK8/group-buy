import { Timestamp } from 'firebase/firestore';

export interface ChatMessage {
    _id: string | number;
    text: string;
    senderUID: string | number;
    createdAt: Timestamp;
}

export interface ChatUser {
    uid: string;
    displayName: string;
    avatar: string;
}

export interface ChatData {
    name: string;
    ownerID: string;
    groupBuyID: string,
    photoURL: string;
    participants: string[];
    lastMessage: string;
    lastMessageAt: string;
}