import { HSuiteNodeConfig } from './types/config';
import { SaucerSwapV1 } from './class/providers/saucer-swap-v1';
import { SaucerSwapV2 } from './class/providers/saucer-swap-v2';
import { HSuite } from './class/providers/h-suite';
import { Provider } from './class/providers/provider';
import tokenListMainnet from './tokenListMainnet.json';
import { AggregatorId } from './class/providers/types/props';
import { Pangolin } from './class/providers/pangolin';
import { HeliSwap } from './class/providers/heli-swap';

export const NETWORK: string = 'mainnet';
export const MIRRORNODE: string = 'https://mainnet-public.mirrornode.hedera.com';
export const TOKEN_LIST: string[] = tokenListMainnet;
export const DEFAULT_TOKENS: number[] = [0, 2];
export const PROVIDERS: Partial<Record<AggregatorId, Provider>> = {
    SaucerSwapV2: new SaucerSwapV2({
        getTokensUrl: 'https://api.saucerswap.finance/tokens',
        whbar: '0x0000000000000000000000000000000000163b5a',
    }),
    SaucerSwapV1: new SaucerSwapV1({
        getTokensUrl: 'https://api.saucerswap.finance/tokens',
        whbar: '0x0000000000000000000000000000000000163b5a',
    }),
    Pangolin: new Pangolin({
        getTokensUrl: 'https://raw.githubusercontent.com/pangolindex/tokenlists/main/pangolin.tokenlist.json',
        whbar: '0x00000000000000000000000000000000001a8837',
    }),
    HeliSwap: new HeliSwap({
        getTokensUrl: 'https://heliswap.infura-ipfs.io/ipfs/Qmf5u6N2ohZnBc1yxepYzS3RYagkMZbU5dwwU4TGxXt9Lf',
        whbar: '0x00000000000000000000000000000000002cc823',
    }),
    HSuite: new HSuite({
        getTokensUrl: 'https://mainnet-sn1.hbarsuite.network/tokens/list',
    })
};
export const EXCHANGE_ADDRESS = '0.0.4817907';
export const API = 'https://api.etaswap.com/v1';
export const WHBAR_LIST = [
    '0x0000000000000000000000000000000000163b5a',
    '0x00000000000000000000000000000000001a8837',
    '0x00000000000000000000000000000000002cc823',
];
export const HSUITE_API_KEY = 'd5db1f4a-8791-4f12-925f-920754547ce7';
export const HSUITE_TOKEN_ADDRESS = '0x00000000000000000000000000000000000c01f3';
export const HSUITE_NODES: HSuiteNodeConfig[] = [
    {
            'operator': '0.0.1786597',
            'publicKey': '302a300506032b65700321003f54816030c29221e4f228c76415cba0db1ab4c49827d9dbf580abc2f2b29c24',
            'url': 'https://mainnet-sn1.hbarsuite.network'
        },
        {
            'operator': '0.0.1786598',
            'publicKey': '302a300506032b6570032100233b043e21d5e148f48e2c2da6607a1f5e6fc381781bd0561967743a8291785e',
            'url': 'https://mainnet-sn2.hbarsuite.network'
        },
        {
            'operator': '0.0.1786599',
            'publicKey': '302a300506032b6570032100c236c88b0aadccf86cc09c57734401409e301d45018ab179f8463801f486c89a',
            'url': 'https://mainnet-sn3.hbarsuite.network'
        },
        {
            'operator': '0.0.1786344',
            'publicKey': '302a300506032b65700321004e3c29113c911ce6dba13669fda53ed1ab3d89547e23c0b7ab2275fd5dc05766',
            'url': 'https://mainnet-sn4.hbarsuite.network'
        },
        {
            'operator': '0.0.1786344',
            'publicKey': '302a300506032b65700321004e3c29113c911ce6dba13669fda53ed1ab3d89547e23c0b7ab2275fd5dc05766',
            'url': 'https://mainnet-sn5.hbarsuite.network'
        },
        {
            'operator': '0.0.1786345',
            'publicKey': '302a300506032b6570032100077bfba9f0fb180026f0de51d4e1083d616eff34a8fe62a1c0e34dd975b7f8cf',
            'url': 'https://mainnet-sn6.hbarsuite.network'
        },
        {
            'operator': '0.0.1786347',
            'publicKey': '302a300506032b6570032100ff792317f5a24278f1a2dddfc9a23670e158ccb9ecd42cdd0ab36e5ad8bc40a6',
            'url': 'https://mainnet-sn7.hbarsuite.network'
        },
        {
            'operator': '0.0.1786365',
            'publicKey': '302a300506032b6570032100485e23e18834571e466f96de9f96f228a1f5da860b319f0f0cb2890f938f298d',
            'url': 'https://mainnet-sn8.hbarsuite.network'
        }
];
