export type Contribution = {
    userUID: string;
    amount: number;
};

export interface GroupBuyDetails {
    id: string;
    dealID: string;
    participants: string[];
    contributions: Contribution[];
    chatRoomID: string;
}