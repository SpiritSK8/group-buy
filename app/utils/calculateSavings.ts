import { Deal } from '../types/Deal';

/**
 * Calculates the total monetary savings for a given deal based on its type.
 * This function is type-safe due to the discriminated union on `deal.dealType`.
 * @param deal The deal object.
 * @returns The total monetary savings for the deal.
 */
export function calculateSavings(deal: Deal): number {
    switch (deal.dealType) {
        case 'minItemPurchase': {
            // Savings from a percentage discount on a set number of items.
            const originalTotal = deal.itemOrigPrice * deal.totalItems;
            const discountedTotal = originalTotal * (1 - deal.discount / 100);
            return (originalTotal - discountedTotal) / deal.totalItems;
        }
        case 'buyXGetY': {
            // Savings are the value of the free items.
            return deal.itemOrigPrice * deal.itemFree / (deal.itemReq + deal.itemFree);
        }
        case 'packageDeal': {
            // Savings from a fixed bundle price compared to the original total.
            const originalTotal = deal.itemOrigPrice * deal.itemQuantityReq;
            return (originalTotal - deal.itemTotalPrice) / deal.itemQuantityReq;
        }
    }
}
