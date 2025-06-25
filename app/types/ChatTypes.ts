import { Timestamp } from "firebase/firestore";

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

export interface ChatPreview {
    lastMessage: string;
    updatedAt: Timestamp;
    otherUserUID: string;
}