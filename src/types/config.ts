import { Provider } from '../class/providers/provider';

export type ProviderConfig = {
    getTokensUrl: string;
    whbar?: string;
    provider: Provider;
}

export type HSuiteNodeConfig = {
    operator: string,
    publicKey: string,
    url: string;
}