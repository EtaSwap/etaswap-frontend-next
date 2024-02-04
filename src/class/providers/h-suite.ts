import { Provider } from './provider';
import { Props } from './types/props';
import { Token } from '../../types/token';
import { HSuiteGetToken } from './types/tokens';
import { ContractId, TokenId } from '@hashgraph/sdk';
// @ts-ignore
import HSuiteLogo from '../../assets/img/hsuite.png';
import { NETWORKS } from '../../utils/constants';
import { Price } from './types/price';
import { BigNumber, ethers } from 'ethers';
import axios from 'axios';
import { sqrt } from '../../utils/utils';

export class HSuite extends Provider {
    public icon = HSuiteLogo;
    public aggregatorId = 'HSuite';
    public feePromille = 3;
    public feeDEXPromille = 3;

    constructor(props: Props) {
        super(props);
    }

    public mapProviderTokenToToken(providerToken: HSuiteGetToken): Token {
        const solidityAddress = `0x${ContractId.fromString(providerToken.id).toSolidityAddress()}`.toLowerCase();
        return {
            name: providerToken.name,
            symbol: providerToken.symbol,
            decimals: providerToken.decimals,
            address: providerToken.id,
            solidityAddress,
            icon: providerToken.image ? decodeURIComponent(providerToken.image) : '',
            providers: [this.aggregatorId],
        }
    }

    public getApiKey(network: string): string {
        if (network === NETWORKS.TESTNET) {
            return '25f54dd3-47a1-4667-b9d8-2863585bc460';
        }
        return 'd5db1f4a-8791-4f12-925f-920754547ce7';
    }

    public getPrice(tokenA: string, tokenB: string, network: string): Promise<Price> | null {
        if (!tokenA || !tokenB || !network) {
            return null;
        }

        let idA = TokenId.fromSolidityAddress(tokenA).toString();
        let idB = TokenId.fromSolidityAddress(tokenB).toString();
        if (tokenA === ethers.constants.AddressZero) {
            idA = 'HBAR';
        }
        if (tokenB === ethers.constants.AddressZero) {
            idB = 'HBAR';
        }

        return new Promise(async resolve => {
            const { data } = await axios.get(`https://${network}-sn1.hbarsuite.network/pools/price?amount=0&baseToken=${idA}&swapToken=${idB}`);
            if (!data.length) {
                return resolve({ rate: null, weight: null });
            }
            const decimalsA = +data[0].payin.tokenDecimals;
            const decimalsB = +data[data.length - 1].payout.tokenDecimals;
            const balanceA: string = data[0].ratio.baseToken.amount.split('.');
            const balanceB: string = data[data.length - 1].ratio.swapToken.amount.split('.');
            const balanceACoins = `${balanceA[0]}${(balanceA[1] || '').padEnd(decimalsA, '0')}`;
            const balanceBCoins = `${balanceB[0]}${(balanceB[1] || '').padEnd(decimalsB, '0')}`;
            resolve({
                rate: BigNumber.from(balanceBCoins).mul(BigNumber.from('1000000000000000000')).div(BigNumber.from(balanceACoins)),
                weight: sqrt(BigNumber.from(balanceACoins).mul(balanceBCoins)),
            });
        });
    }
}