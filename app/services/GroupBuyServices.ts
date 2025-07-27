import { collection, addDoc, serverTimestamp, doc, getDoc, getDocs, query, orderBy, DocumentData, setDoc, updateDoc } from "firebase/firestore";
import { database } from "../firebaseConfig";
import { Deal } from "../types/Deal";
import { Alert } from "react-native";
import ChatServices from "./ChatServices";
import DealsServices from "./DealsServices";
import { Contribution, GroupBuyDetails } from "../types/GroupBuyTypes";

class GroupBuyServices {
    /**
     * @param dealID The ID of the deal this GroupBuy is based of.
     * @returns a Promise containing the ID of the created GroupBuy. Returns null if failed.
     */
    static async createAndJoinGroupBuy(userUID: string, dealID: string, amount: number): Promise<string | null> {
        try {
            const deal = await DealsServices.fetchDeal(dealID);
            if (!deal) {
                throw new Error("Deal not found.");
            }

            const contribution: Contribution = { userUID, amount };

            const data = {
                dealID: dealID,
                ownerUID: userUID,
                participants: [userUID],
                contributions: [contribution],
                status: "active" as const,
                acceptingNewMembers: true,
                createdAt: serverTimestamp()
            };
            const doc = await addDoc(collection(database, "groupBuys"), data);

            const chatRoomID = await ChatServices.createAndJoinChatRoom(userUID, deal.dealName, "", doc.id); // TODO: Fill photo URL.
            if (!chatRoomID) {
                throw new Error("Error creating chat room.");
            }

            await updateDoc(doc, { chatRoomID: chatRoomID });

            return doc.id;
        } catch (error: any) {
            Alert.alert("Error creating GroupBuy", error.message);
            return null;
        }
    }

    static async joinGroupBuy(userUID: string, groupBuyID: string, contribution: number): Promise<void> {
        try {
            const groupBuyDoc = await getDoc(doc(database, "groupBuys", groupBuyID));
            if (!groupBuyDoc.exists()) {
                // The specified GroupBuy doesn"t exist.
                return;
            }

            if (await this.isUserInGroupBuy(userUID, groupBuyID)) {
                // User is already inside this GroupBuy.
                return;
            }

            const participants = groupBuyDoc.data().participants;
            participants.push(userUID);
            const contributions = groupBuyDoc.data().contributions;
            contributions.push({ userUID: userUID, amount: contribution });
            await updateDoc(doc(database, "groupBuys", groupBuyID), { participants, contributions });
            await ChatServices.joinChatRoom(userUID, groupBuyDoc.data().chatRoomID);

        } catch (error: any) {
            console.error("An error occured.", error.message);
        }
    }

    static async isUserInGroupBuy(userUID: string, groupBuyID: string): Promise<boolean> {
        try {
            const groupBuyDoc = await getDoc(doc(database, "groupBuys", groupBuyID));
            if (groupBuyDoc.exists()) {
                const participants = groupBuyDoc.data().participants;
                return participants.includes(userUID);
            }

            return false;
        } catch (error) {
            console.error("An error occured.");
            return false;
        }
    }

    static async fetchGroupBuy(groupBuyID: string): Promise<GroupBuyDetails | null> {
        const groupBuyDoc = await getDoc(doc(database, "groupBuys", groupBuyID));
        if (groupBuyDoc.exists()) {
            const data = groupBuyDoc.data();
            return {
                id: groupBuyDoc.id,
                dealID: data.dealID,
                ownerUID: data.ownerUID || data.participants[0], // Fallback for existing data
                participants: data.participants,
                contributions: data.contributions,
                chatRoomID: data.chatRoomID,
                status: data.status || "active",
                acceptingNewMembers: data.acceptingNewMembers !== undefined ? data.acceptingNewMembers : true
            };
        }
        return null;
    }

    static async fetchAllGroupBuy(): Promise<GroupBuyDetails[]> {
        const q = query(
            collection(database, "groupBuys"),
            orderBy("createdAt", "desc")
        );

        const snapshot = await getDocs(q);

        const result = Promise.all(
            snapshot.docs.map(async (docSnap) => {
                const data = docSnap.data();
                return {
                    id: docSnap.id,
                    dealID: data.dealID,
                    ownerUID: data.ownerUID || data.participants[0], // Fallback for existing data
                    participants: data.participants,
                    contributions: data.contributions,
                    chatRoomID: data.chatRoomID,
                    status: data.status || "active",
                    acceptingNewMembers: data.acceptingNewMembers !== undefined ? data.acceptingNewMembers : true
                } as GroupBuyDetails;
            })
        );

        return result;
    }

    static async updateUserContribution(groupBuyID: string, userUID: string, newAmount: number): Promise<void> {
        try {
            const groupBuyDoc = await getDoc(doc(database, "groupBuys", groupBuyID));
            if (!groupBuyDoc.exists()) {
                throw new Error("GroupBuy not found.");
            }

            const data = groupBuyDoc.data();
            const contributions = data.contributions as Contribution[];

            // Find and update the user"s contribution
            const updatedContributions = contributions.map(contribution =>
                contribution.userUID === userUID
                    ? { ...contribution, amount: newAmount }
                    : contribution
            );

            await updateDoc(doc(database, "groupBuys", groupBuyID), {
                contributions: updatedContributions
            });

        } catch (error: any) {
            console.error("Error updating contribution:", error);
            throw error;
        }
    }

    static async exitGroupBuy(userUID: string, groupBuyID: string): Promise<void> {
        try {
            const groupBuyDoc = await getDoc(doc(database, "groupBuys", groupBuyID));
            if (!groupBuyDoc.exists()) {
                throw new Error("GroupBuy not found.");
            }
            const data = groupBuyDoc.data();
            const participants = data.participants as string[];
            const contributions = data.contributions as Contribution[];

            // Remove user from participants and contributions
            const updatedParticipants = participants.filter(uid => uid !== userUID);
            const updatedContributions = contributions.filter(contribution => contribution.userUID !== userUID);

            await updateDoc(doc(database, "groupBuys", groupBuyID), {
                participants: updatedParticipants,
                contributions: updatedContributions
            });

            // Leave the chat room
            await ChatServices.leaveChatRoom(userUID, data.chatRoomID);
        } catch (error: any) {
            console.error("Error exiting GroupBuy:", error);
            throw error;
        }
    }

    static async toggleAcceptingNewMembers(groupBuyID: string, ownerUID: string): Promise<void> {
        try {
            const groupBuyDoc = await getDoc(doc(database, "groupBuys", groupBuyID));
            if (!groupBuyDoc.exists()) {
                throw new Error("GroupBuy not found.");
            }

            const data = groupBuyDoc.data();
            if (data.ownerUID !== ownerUID) {
                throw new Error("Only the owner can modify this setting.");
            }

            await updateDoc(doc(database, "groupBuys", groupBuyID), {
                acceptingNewMembers: !data.acceptingNewMembers
            });
        } catch (error: any) {
            console.error("Error toggling new member acceptance:", error);
            throw error;
        }
    }

    static async finishGroupBuy(groupBuyID: string, ownerUID: string): Promise<void> {
        try {
            const groupBuyDoc = await getDoc(doc(database, "groupBuys", groupBuyID));
            if (!groupBuyDoc.exists()) {
                throw new Error("GroupBuy not found.");
            }

            const data = groupBuyDoc.data();
            if (data.ownerUID !== ownerUID) {
                throw new Error("Only the owner can finish the GroupBuy.");
            }

            await updateDoc(doc(database, "groupBuys", groupBuyID), {
                status: "finished",
                acceptingNewMembers: false
            });
        } catch (error: any) {
            console.error("Error finishing GroupBuy:", error);
            throw error;
        }
    }

    static async kickMember(groupBuyID: string, ownerUID: string, memberUID: string): Promise<void> {
        try {
            const groupBuyDoc = await getDoc(doc(database, "groupBuys", groupBuyID));
            if (!groupBuyDoc.exists()) {
                throw new Error("GroupBuy not found.");
            }

            const data = groupBuyDoc.data();
            if (data.ownerUID !== ownerUID) {
                throw new Error("Only the owner can kick members.");
            }

            if (memberUID === ownerUID) {
                throw new Error("Owner cannot kick themselves.");
            }

            const participants = data.participants as string[];
            const contributions = data.contributions as Contribution[];

            // Remove member from participants and contributions
            const updatedParticipants = participants.filter(uid => uid !== memberUID);
            const updatedContributions = contributions.filter(contribution => contribution.userUID !== memberUID);

            await updateDoc(doc(database, "groupBuys", groupBuyID), {
                participants: updatedParticipants,
                contributions: updatedContributions
            });

            // Remove member from chat room
            await ChatServices.leaveChatRoom(memberUID, data.chatRoomID);
        } catch (error: any) {
            console.error("Error kicking member:", error);
            throw error;
        }
    }
}

export default GroupBuyServices;