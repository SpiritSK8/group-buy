import { collection, addDoc, serverTimestamp, doc, getDoc, getDocs, query, orderBy, DocumentData } from 'firebase/firestore';
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
    static async createGroupBuy(dealID: string): Promise<string | null> {
        try {
            const deal = await DealsServices.fetchDeal(dealID);
            if (!deal) {
                throw new Error('Deal not found.');
            }

            const chatRoomID = await ChatServices.createChatRoom(deal.dealName, ''); // TODO: Fill photo URL.
            if (!chatRoomID) {
                throw new Error('Error creating chat room.');
            }

            const data = {
                dealID: dealID,
                chatRoomID: chatRoomID
            };
            const doc = await addDoc(collection(database, 'deals'), data);

            return doc.id;
        } catch (error: any) {
            Alert.alert('Error creating GroupBuy', error.message);
            return null;
        }
    }

    static async fetchAllGroupBuy(): Promise<GroupBuyDetails[]> {
        const q = query(
            collection(database, 'groupBuys'),
            orderBy('createdAt', 'desc')
        );

        const snapshot = await getDocs(q);

        const result = Promise.all(
            snapshot.docs.map(async (doc) => {
                const data = doc.data();
                return {
                    id: doc.id,
                    dealID: data.dealID,
                    participants: [],
                    chatGroupID: data.chatGroupID,
                } as GroupBuyDetails;
            })
        );

        return result;
    }
}

export default GroupBuyServices;