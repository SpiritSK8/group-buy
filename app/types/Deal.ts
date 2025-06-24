export type Deal = {
    dealID: string;
    dealName: string;
    dealStart: string;
    dealExpiry: string;
    dealStore: string;
    dealUrl: string;
    isActive: boolean; 
    itemName: string; 
    itemOrigPrice: number; // Original price of the item
    dealType: 'minItemPurchase' | 'buyXGetY' | 'packageDeal'; //minItemPurchase is for buy x items fo x% off
    minPurchase?: number; // for minItemPurchase;
    totalItems?: number; // for minItemPurchase
    discount?: number; // for minItemPurchase
    itemReq?: number; // for buyXGetY
    itemFree?: number; // for buyXGetY
    itemQuantityReq?: number; // for packageDeal
    itemTotalPrice?: number; // for packageDeal


  };
  

