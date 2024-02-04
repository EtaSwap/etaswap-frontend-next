import { BigNumber } from 'ethers';

export type SortedPrice = {
    //input
    name: string;
    weight: BigNumber;
    price: BigNumber;

    //output
    priceImpact: BigNumber;
    amountOut: BigNumber;
}