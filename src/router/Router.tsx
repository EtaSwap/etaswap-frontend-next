import React from 'react';
import Swap from "../pages/Swap/Swap";
import Tokens from "../pages/Tokens/Tokens";
import {Route, Routes} from "react-router-dom";
import {IWallet} from "../models";
import { Token } from '../types/token';
import { Provider } from '../class/providers/provider';

export interface IAppRouterProps{
    wallet: IWallet;
    tokens: Map<string, Token>;
    network: string;
    rate: number | null;
    providers: Record<string, Provider>;
}

const AppRouter = ({wallet, tokens, network, rate, providers}: IAppRouterProps) => {

    return (
        <Routes>
            <Route path="/" element={
                <Swap
                    wallet={wallet}
                    tokens={tokens}
                    network={network}
                    rate={rate}
                    providers={providers}
                />
            }/>
            <Route path="/tokens" element={<Tokens tokens={tokens}/>}/>
        </Routes>
    );
};

export default AppRouter;
