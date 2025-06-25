import { addDoc, collection, doc, getDoc, onSnapshot, orderBy, query, setDoc } from 'firebase/firestore';
import { auth, database } from '../firebaseConfig';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, updateProfile, User } from 'firebase/auth';
import { Deal } from '../types/Deal';

class DealsServices {
    // static async fetchDeals(): Promise<Deal[]> {
    //     const q = query(collection(database, 'deals'), orderBy('createdAt', 'desc'));
    //     const unsubscribe = onSnapshot(q, snapshot => {
    //         const deals: Deal[] = snapshot.docs.map(
    //             doc => {
    //                 const data = doc.data();
    //                 return {
    //                     ...data
    //                 };
    //             }
    //         )
    //     });
    // }

    static async fetchDeal(dealID: string): Promise<Deal | null> {
        const dealDoc = await getDoc(doc(database, 'deals', dealID));
        if (dealDoc.exists()) {
            const data = dealDoc.data();
            return {
                dealID: data.dealID,
                dealName: data.dealName,
                dealStart: data.dealStart,
                dealExpiry: data.dealExpiry,
                dealStore: data.dealStore,
                dealUrl: data.dealUrl,
                isActive: data.isActive,
                itemName: data.itemName,
                itemOrigPrice: data.itemOrigPrice,
                dealType: data.dealType
            }
        }
        return null;
    }

    static async addDeal(deal: Deal): Promise<void> {
        await setDoc(doc(database, 'deals', deal.dealID), deal);
    }
}

export default DealsServices;