import { BigNumber } from 'ethers';

export type Price = {
    rate: BigNumber | null;
    weight: BigNumber | null;
}