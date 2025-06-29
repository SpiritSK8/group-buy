
import { collection, addDoc, serverTimestamp, doc, getDoc, getDocs,query,orderBy,QueryDocumentSnapshot,DocumentData} from 'firebase/firestore';
import { database } from '../firebaseConfig';
import { Deal } from '../types/Deal';

export default class DealsServices {
    /**
     * Fetches a deal by its ID from Firestore.
     * @param dealID The ID of the deal to fetch.
     * @returns A Promise that resolves to a Deal object or null if not found.
     */

  static async fetchDeal(dealID: string): Promise<Deal | null> {
    const docRef = doc(database, 'deals', dealID);
    const snap = await getDoc(docRef);
    if (!snap.exists()) return null;

    const data = snap.data() as any;

    const common = {
      dealID: snap.id,
      dealName: data.dealName,
      dealStart: data.dealStart,
      dealExpiry: data.dealExpiry,
      dealStore: data.dealStore,
      dealUrl: data.dealUrl,
      isActive: data.isActive,
      itemName: data.itemName,
      itemOrigPrice: data.itemOrigPrice,
    };

    switch (data.dealType) {
      case 'minItemPurchase':
        return {
          ...common,
          dealType: 'minItemPurchase',
          minPurchase: data.minPurchase!,
          totalItems: data.totalItems!,
          discount: data.discount!,
        };
      case 'buyXGetY':
        return {
          ...common,
          dealType: 'buyXGetY',
          itemReq: data.itemReq!,
          itemFree: data.itemFree!,
        };
      case 'packageDeal':
        return {
          ...common,
          dealType: 'packageDeal',
          itemQuantityReq: data.itemQuantityReq!,
          itemTotalPrice: data.itemTotalPrice!,
        };
      default:
        return null;
    }
  }
  static async fetchDeals(): Promise<Deal[]> {
    // Build the query
    const q = query(
      collection(database, 'deals'),
      orderBy('dealStart', 'asc')
    );

    // Execute it
    const snapshot = await getDocs(q);

    // Map each document into a Deal
    return snapshot.docs.map((doc) => {
      const data = doc.data() as DocumentData;
      const common = {
        dealID: doc.id,
        dealName: data.dealName,
        dealStart: data.dealStart,
        dealExpiry: data.dealExpiry,
        dealStore: data.dealStore,
        dealUrl: data.dealUrl,
        isActive: data.isActive,
        itemName: data.itemName,
        itemOrigPrice: data.itemOrigPrice,
      };

      switch (data.dealType) {
        case 'minItemPurchase':
          return {
            ...common,
            dealType: 'minItemPurchase',
            minPurchase: data.minPurchase!,
            totalItems: data.totalItems!,
            discount: data.discount!,
          };
        case 'buyXGetY':
          return {
            ...common,
            dealType: 'buyXGetY',
            itemReq: data.itemReq!,
            itemFree: data.itemFree!,
          };
        case 'packageDeal':
          return {
            ...common,
            dealType: 'packageDeal',
            itemQuantityReq: data.itemQuantityReq!,
            itemTotalPrice: data.itemTotalPrice!,
          };
        default:
          throw new Error(
            `Unknown dealType "${data.dealType}" in document ${doc.id}`
          );
      }
    });
  }

  static async createDeal(
    dealData: Omit<Deal, 'dealID'>
  ): Promise<Deal> {
    try {
      // 1️⃣ Prepare payload, cast to DocumentData so TS allows `createdAt`
      const payload = {
        ...dealData,
        createdAt: serverTimestamp(),
      } as DocumentData;

      // 2️⃣ Write new doc
      const ref = await addDoc(collection(database, 'deals'), payload);

      // 3️⃣ Read it back so we get real Timestamp fields
      const snap = await getDoc(ref);
      if (!snap.exists()) {
        throw new Error(`Document ${ref.id} not found after create.`);
      }
      const data = snap.data() as any;

      // 4️⃣ Build the “common” part of the Deal
      const common = {
        dealID: ref.id,
        dealName: data.dealName,
        dealStart: data.dealStart,
        dealExpiry: data.dealExpiry,
        dealStore: data.dealStore,
        dealUrl: data.dealUrl,
        isActive: data.isActive,
        itemName: data.itemName,
        itemOrigPrice: data.itemOrigPrice,
      };

      // 5️⃣ Narrow on dealType to return the correct union member
      switch (data.dealType) {
        case 'minItemPurchase':
          return {
            ...common,
            dealType: 'minItemPurchase',
            minPurchase: data.minPurchase!,
            totalItems: data.totalItems!,
            discount: data.discount!,
          };
        case 'buyXGetY':
          return {
            ...common,
            dealType: 'buyXGetY',
            itemReq: data.itemReq!,
            itemFree: data.itemFree!,
          };
        case 'packageDeal':
          return {
            ...common,
            dealType: 'packageDeal',
            itemQuantityReq: data.itemQuantityReq!,
            itemTotalPrice: data.itemTotalPrice!,
          };
        default:
          throw new Error(
            `Unknown dealType "${data.dealType}" in newly created doc ${ref.id}`
          );
      }
    } catch (err) {
      console.error('DealsServices.createDeal failed', err);
      throw err;
    }
  }

}
