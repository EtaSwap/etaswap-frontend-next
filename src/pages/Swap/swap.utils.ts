import {NETWORKS} from "../../utils/constants";
import { Provider } from '../../class/providers/provider';
import { Price } from '../../class/providers/types/price';

export const defaultPrices = {
    SaucerSwap: null,
    Pangolin: null,
    HeliSwap: null,
    HSuite: null,
};

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
