import { GetToken, GetTokensResponse } from './types/tokens';
import axios, { AxiosResponse } from 'axios';
import { AggregatorId, Props } from './types/props';
import { Token } from '../../types/token';
import { Price } from './types/price';
import { ethers } from 'ethers';

export abstract class Provider {
    public abstract icon: string;
    public abstract aggregatorId: AggregatorId;
    public abstract feePromille: number;
    public abstract feeDEXPromille: number;
    protected props: Props;
    protected constructor(props: Props) {
        this.props = props;
    }
    public getTokens(network: string): Promise<AxiosResponse<GetTokensResponse>> | null {
        if (!this.props.getTokensUrl) {
            return null;
        }
         return axios.get(this.props.getTokensUrl!);
    };

    abstract mapProviderTokenToToken(providerToken: GetToken): Token;

    public getWHBAR(): string | undefined {
        return this.props.whbar;
    }

    public getApiKey(): string | undefined {
        return;
    }
}