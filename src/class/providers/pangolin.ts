import { Provider } from './provider';
import { AggregatorId, Props } from './types/props';
import { PangolinGetToken } from './types/tokens';
import { Token } from '../../types/token';
import { ContractId } from '@hashgraph/sdk';
// @ts-ignore
import PangolinLogo from '../../assets/img/pangolin.png';

export class Pangolin extends Provider {
    public icon = PangolinLogo;
    public aggregatorId = AggregatorId.Pangolin;
    public feePromille = 3;
    public feeDEXPromille = 3;

    constructor(props: Props) {
        super(props);
    }

    public mapProviderTokenToToken(providerToken: PangolinGetToken): Token {
        return {
            name: providerToken.name,
            symbol: providerToken.symbol,
            decimals: providerToken.decimals,
            address: ContractId.fromSolidityAddress(providerToken.address).toString(),
            solidityAddress: providerToken.address,
            icon: providerToken.logoURI || '',
            providers: [this.aggregatorId],
        }
    }
}