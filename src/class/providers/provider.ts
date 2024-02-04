import { GetToken, GetTokensResponse } from './types/tokens';
import axios, { AxiosResponse } from 'axios';
import { Props } from './types/props';
import { Token } from '../../types/token';
import { Price } from './types/price';
import { ethers } from 'ethers';

export abstract class Provider {
    public abstract icon: string;
    public abstract aggregatorId: string;
    public abstract feePromille: number;
    public abstract feeDEXPromille: number;
    protected props: Props;
    protected constructor(props: Props) {
        this.props = props;
    }
    public getTokens(network: string): Promise<AxiosResponse<GetTokensResponse>> | null {
        if (!this.props[network].getTokensUrl) {
            return null;
        }
         return axios.get(this.props[network].getTokensUrl!);
    };

    abstract mapProviderTokenToToken(providerToken: GetToken): Token;

    public getWHBAR(network: string): string | null {
        return this.props[network].whbar;
    }

    public getOracle(network: string): any | null {
        return this.props[network].oracle;
    }

    public getApiKey(network: string): string | null {
        return null;
    }

    public getPrice(tokenA: string, tokenB: string, network: string, oracleContract: any): Promise<Price> | null {
        let _tokenA = tokenA;
        let _tokenB = tokenB;
        if (tokenA === ethers.constants.AddressZero) {
            _tokenA = this.getWHBAR(network)!;
        }
        if (tokenB === ethers.constants.AddressZero) {
            _tokenB = this.getWHBAR(network)!;
        }
        return oracleContract.getRate(_tokenA, _tokenB);
    }
}