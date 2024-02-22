export type Props = {
    getTokensUrl: string;
    whbar?: string;
}

export enum AggregatorId {
    SaucerSwapV1 = 'SaucerSwapV1',
    SaucerSwapV2 = 'SaucerSwapV2',
    Pangolin = 'Pangolin',
    HeliSwap = 'HeliSwap',
    HSuite = 'HSuite'
}