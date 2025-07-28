import { Timestamp } from "firebase/firestore";

export type Contribution = {
    userUID: string;
    amount: number;
};

export type GroupBuyStatus = "active" | "closed" | "finished";

export interface GroupBuyDetails {
    id: string;
    dealID: string;
    ownerUID: string;
    participants: string[];
    contributions: Contribution[];
    purchaseDate: Timestamp;
    chatRoomID: string;
    status: GroupBuyStatus;
    createdAt: Timestamp;
}

