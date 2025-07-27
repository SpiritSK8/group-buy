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
    chatRoomID: string;
    status: GroupBuyStatus;
}

