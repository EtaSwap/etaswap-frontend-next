export type SaucerSwapGetToken = {
    decimals: number;
    description: string;
    dueDiligenceComplete: boolean;
    icon: string;
    id: string;
    isFeeOnTransferToken: boolean;
    price: string;
    priceUsd: number;
    sentinelReport: unknown;
    symbol: string;
    timestampSecondsLastListingChange: number
    twitterHandle: string;
    website: string;
};

export type SaucerSwapGetTokensResponse = SaucerSwapGetToken[];

export type PangolinGetToken = {
    address: string;
    chainId: number;
    decimals: number;
    logoURI: string;
    name: string;
    symbol: string;
}

export type PangolinGetTokensResponse = {
    keywords: Array<string>;
    logoURI: string;
    name: string;
    timestamp: string;
    tokens: PangolinGetToken[];
    version: Record<string, any>;
}

export type HeliSwapGetToken = {
    address: string;
    chainId: number;
    decimals: number;
    logoURI: string;
    name: string;
    symbol: string;
}

export type HeliSwapGetTokensResponse = {
    keywords: Array<string>;
    logoURI: string;
    name: string;
    tags: unknown;
    timestamp: string;
    tokens: HeliSwapGetToken[];
    version: Record<string, any>;
}

export type HSuiteGetToken = {
    coingecko_id: unknown;
    consensus_timestamp: string;
    decimals: number;
    id: string | 'HBAR';
    image: string;
    name: string;
    priceBotUrl: string | null;
    symbol: string;
    type: string;
    website: string;
}

export type HSuiteGetTokensResponse = HSuiteGetToken[];

export type GetToken = SaucerSwapGetToken | PangolinGetToken | HeliSwapGetToken | HSuiteGetToken;
export type GetTokensResponse = SaucerSwapGetTokensResponse | PangolinGetTokensResponse | HeliSwapGetTokensResponse | HSuiteGetTokensResponse;