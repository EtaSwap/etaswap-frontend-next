import { BigNumber } from 'ethers';
import { AggregatorId } from '../class/providers/types/props';

export enum TransactionType {
    SWAP = 'SWAP',
}

export type SortedPrice = {
    //output
    transactionType: TransactionType,
    aggregatorId: AggregatorId,
    path: string;
    amountIn: BigNumber;
    amountOut: BigNumber;
    priceImpact: number;
    gasEstimate: number;
}