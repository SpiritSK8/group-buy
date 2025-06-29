import { collection, addDoc, serverTimestamp, doc, getDoc, getDocs, query, orderBy, DocumentData, setDoc, updateDoc } from 'firebase/firestore';
import { database } from '../firebaseConfig';
import { Deal } from '../types/Deal';
import { Alert } from 'react-native';
import ChatServices from './ChatServices';
import DealsServices from './DealsServices';
import { GroupBuyDetails } from '../types/GroupBuyTypes';

class GroupBuyServices {
    /**
     * @param dealID The ID of the deal this GroupBuy is based of.
     * @returns a Promise containing the ID of the created GroupBuy. Returns null if failed.
     */
    static async createAndJoinGroupBuy(userUID: string, dealID: string): Promise<string | null> {
        try {
            const deal = await DealsServices.fetchDeal(dealID);
            if (!deal) {
                throw new Error('Deal not found.');
            }

            const chatRoomID = await ChatServices.createAndJoinChatRoom(userUID, deal.dealName, ''); // TODO: Fill photo URL.
            if (!chatRoomID) {
                throw new Error('Error creating chat room.');
            }

            const data = {
                dealID: dealID,
                chatRoomID: chatRoomID,
                participants: [userUID],
                createdAt: serverTimestamp()
            };
            const doc = await addDoc(collection(database, 'groupBuys'), data);

            return doc.id;
        } catch (error: any) {
            Alert.alert('Error creating GroupBuy', error.message);
            return null;
        }
    }

    static async joinGroupBuy(userUID: string, groupBuyID: string): Promise<void> {
        try {
            const groupBuyDoc = await getDoc(doc(database, 'groupBuys', groupBuyID));
            if (!groupBuyDoc.exists()) {
                // The specified GroupBuy doesn't exist.
                return;
            }

            if (await this.isUserInGroupBuy(userUID, groupBuyID)) {
                // User is already inside this GroupBuy.
                return;
            } else {
                const participants = groupBuyDoc.data().participants;
                participants.push(userUID);
                await updateDoc(doc(database, 'groupBuys', groupBuyID), { participants });
                await ChatServices.joinChatRoom(userUID, groupBuyDoc.data().chatRoomID);
            }
        } catch (error) {
            console.error('An error occured.');
        }
    }

    static async isUserInGroupBuy(userUID: string, groupBuyID: string): Promise<boolean> {
        try {
            const groupBuyDoc = await getDoc(doc(database, 'groupBuys', groupBuyID));
            if (groupBuyDoc.exists()) {
                const participants = groupBuyDoc.data().participants;
                return participants.includes(userUID);
            }

            return false;
        } catch (error) {
            console.error('An error occured.');
            return false;
        }
    }

    static async fetchGroupBuy(groupBuyID: string): Promise<GroupBuyDetails | null> {
        const groupBuyDoc = await getDoc(doc(database, 'groupBuys', groupBuyID));
        if (groupBuyDoc.exists()) {
            const data = groupBuyDoc.data();
            return {
                id: groupBuyDoc.id,
                dealID: data.dealID,
                participants: data.participants,
                chatRoomID: data.chatRoomID
            };
        }
        return null;
    }

    static async fetchAllGroupBuy(): Promise<GroupBuyDetails[]> {
        const q = query(
            collection(database, 'groupBuys'),
            orderBy('createdAt', 'desc')
        );

        const snapshot = await getDocs(q);

        const result = Promise.all(
            snapshot.docs.map(async (docSnap) => {
                const data = docSnap.data();
                return {
                    id: docSnap.id,
                    dealID: data.dealID,
                    participants: data.participants,
                    chatRoomID: data.chatGroupID,
                } as GroupBuyDetails;
            })
        );

        return result;
    }
}

export default GroupBuyServices;