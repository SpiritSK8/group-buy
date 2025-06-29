import { Timestamp } from 'firebase/firestore';

// Common properties for all deals
interface DealBase {
    dealID: string;
    dealName: string;
    dealStart: string;
    dealExpiry: string;
    dealStore: string;
    dealUrl: string;
    isActive: boolean;
    itemName: string;
    itemOrigPrice: number; // Original price of the item
}

// For deals like "buy X items for Y% off"
interface MinItemPurchaseDeal extends DealBase {
    dealType: 'minItemPurchase';
    totalItems: number;
    discount: number;
}

// For deals like "buy X get Y free"
interface BuyXGetYDeal extends DealBase {
    dealType: 'buyXGetY';
    itemReq: number;
    itemFree: number;
}

// For deals where a package of items has a fixed price
interface PackageDeal extends DealBase {
    dealType: 'packageDeal';
    itemQuantityReq: number;
    itemTotalPrice: number;
}

export type Deal = MinItemPurchaseDeal | BuyXGetYDeal | PackageDeal;
