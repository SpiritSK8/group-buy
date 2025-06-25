import { Deal } from '../types/Deal';

export function calculateSavings(deal: Deal): number {
    const { itemOrigPrice, dealType, minPurchase, totalItems, discount, itemReq, itemFree, itemQuantityReq, itemTotalPrice } = deal;

    let savings = 0;

    switch (dealType) {
        case 'minItemPurchase':
            if (minPurchase && totalItems && discount) {
                const originalTotal = itemOrigPrice * totalItems;
                const discountedTotal = originalTotal * (1 - discount / 100);
                savings = (originalTotal - discountedTotal)/ totalItems; // Savings per item
            }
            break;

        case 'buyXGetY':
            if (itemReq && itemFree) {
                const effectiveItems = itemReq + itemFree;
                savings = (itemOrigPrice * itemFree)/ effectiveItems; // Savings per item
            }
            break;

        case 'packageDeal':
            if (itemQuantityReq && itemTotalPrice) {
                const originalTotal = itemOrigPrice * itemQuantityReq;
                savings = (originalTotal - itemTotalPrice)/ itemQuantityReq; // Savings per item
            }
            break;

        default:
            break;
    }

    return savings;

}
