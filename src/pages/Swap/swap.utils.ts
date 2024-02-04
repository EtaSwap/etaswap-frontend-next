import {NETWORKS} from "../../utils/constants";
import {BigNumber, ethers} from "ethers";
import {sqrt} from "../../utils/utils";
import { Provider } from '../../class/providers/provider';
import axios from 'axios';
import { Price } from '../../class/providers/types/price';

export const defaultOracleContracts = {
    SaucerSwap: null,
    Pangolin: null,
    HeliSwap: null,
};

export const defaultPrices = {
    SaucerSwap: null,
    Pangolin: null,
    HeliSwap: null,
    HSuite: null,
};

export const exchange = (network: any) => network === NETWORKS.MAINNET ? '0.0.3745835' : '0.0.1772118';

export const defaultTokens = (tokensMap: any) => ([...tokensMap]
    .map(wrap => wrap[1])
    .sort((a, b) =>
        a.providers.length > b.providers.length
            ? -1
            : (a.providers.length === b.providers.length
                    ? (a.name > b.name ? 1 : -1)
                    : 1
            )
    )
);


export const fetchRates = async (tokenA: any, tokenB: any, network: any, oracleContracts: any, providers: Record<string, Provider>): Promise<Record<string, Price | null>> => {
    const res = await Promise.allSettled([
        oracleContracts.SaucerSwap ? providers.SaucerSwap.getPrice(tokenA, tokenB, network, oracleContracts.SaucerSwap) : null,
        oracleContracts.Pangolin ? providers.Pangolin.getPrice(tokenA, tokenB, network, oracleContracts.Pangolin) : null,
        !oracleContracts.HeliSwap || network === NETWORKS.TESTNET ? null : providers.HeliSwap.getPrice(tokenA, tokenB, network, oracleContracts.HeliSwap),
        providers.HSuite.getPrice(tokenA, tokenB, network, oracleContracts.HSuite),
    ]);

    return {
        SaucerSwap: res[0].status === 'fulfilled' ? res[0].value : null,
        Pangolin: res[1].status === 'fulfilled' ? res[1].value : null,
        HeliSwap: network === NETWORKS.TESTNET ? null : (res[2]?.status === 'fulfilled' ? res[2].value : null),
        HSuite: res[3].status === 'fulfilled' ? res[3].value : null,
    }
}
