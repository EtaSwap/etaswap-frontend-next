import React from 'react'
import './Tokens.css'
import {parseTokens} from "./tokens.utils";
import {IToken} from "../../models";
import { Token } from '../../types/token';

export interface ITokensProps {
    tokens: Map<string, Token>;
}

function Tokens({ tokens }: ITokensProps) {
    return (
    <div className='tokens'>
      <div className=''>
        <h1 className={'tokensHeader'}>These tokens are available to swap:</h1>
      </div>
      <div className={'tokensContainer'}>
      {
          // @ts-ignore
          parseTokens([...tokens]).map((token: IToken) => {
        return (
          <div className='tokenChoice' key={token.solidityAddress}>
            <div className="pulsating-img-container">
                { token.icon? <img src={token.icon} alt={token.symbol} className="tokenLogo"/> : '' }
            </div>
            <div className='tokenChoiceNames'>
              <div className='tokenName'>
                {token.name}
              </div>
              <div className='tokenTicker'>
                {token.symbol} ({token.address})
                </div>
            </div>
            </div>
        )
      })}
    </div>
    </div>
  )
}

export default Tokens
