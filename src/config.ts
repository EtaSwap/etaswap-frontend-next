import { HSuiteNodeConfig } from './types/config';
import { SaucerSwapV1 } from './class/providers/saucer-swap-v1';
import { SaucerSwapV2 } from './class/providers/saucer-swap-v2';
import { HSuite } from './class/providers/h-suite';
import { Provider } from './class/providers/provider';
import tokenListTestnet from './tokenListTestnet.json';
import { AggregatorId } from './class/providers/types/props';

export const NETWORK: string = 'testnet';
export const MIRRORNODE: string = 'https://testnet.mirrornode.hedera.com';
export const TOKEN_LIST: string[] = tokenListTestnet;
export const DEFAULT_TOKENS: number[] = [0, 2];
export const PROVIDERS: Partial<Record<AggregatorId, Provider>> = {
    SaucerSwapV2: new SaucerSwapV2({
        getTokensUrl: 'https://test-api.saucerswap.finance/tokens',
        whbar: '0x0000000000000000000000000000000000003ad1',
    }),
    SaucerSwapV1: new SaucerSwapV1({
        getTokensUrl: 'https://test-api.saucerswap.finance/tokens',
        whbar: '0x0000000000000000000000000000000000003ad1',
    }),
    HSuite: new HSuite({
        getTokensUrl: 'https://testnet-sn1.hbarsuite.network/tokens/list',
    })
};
export const EXCHANGE_ADDRESS = '0.0.3587210';
export const WHBAR_LIST = [
    '0x0000000000000000000000000000000000003ad1'
];
export const HSUITE_API_KEY = '25f54dd3-47a1-4667-b9d8-2863585bc460';
export const HSUITE_TOKEN_ADDRESS = '0x0000000000000000000000000000000000219d8e';
export const HSUITE_NODES: HSuiteNodeConfig[] = [
    {
        operator: '0.0.467726',
        publicKey: '302a300506032b6570032100ae51a8b5d22e40d68fec62e20488132182f304cddbf5cd494d62cb18a06b71c1',
        url: 'https://testnet-sn1.hbarsuite.network'
    },
    {
        operator: '0.0.467732',
        publicKey: '302a300506032b657003210014e45f62427a777c8a5c168115793969c5fa04979b6a40a34c3bff7d20a3b745',
        url: 'https://testnet-sn2.hbarsuite.network'
    },
    {
        operator: '0.0.467734',
        publicKey: '302a300506032b65700321002caf57f6153afb61ed70545516886b1621aa93dd22ae79412f5af0cbfcd2b5ab',
        url: 'https://testnet-sn3.hbarsuite.network'
    },
    {
        operator: '0.0.467737',
        publicKey: '302a300506032b6570032100452e3d988c2f0e40b6194c7543ec880daaefa29b6c48e590b367bbe22de429d3',
        url: 'https://testnet-sn4.hbarsuite.network'
    }
];