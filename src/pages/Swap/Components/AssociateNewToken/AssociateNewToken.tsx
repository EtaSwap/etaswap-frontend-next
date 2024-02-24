import './AssociateNewToken.css'
import {Token} from "../../../../types/token";

export interface IAssociateNewTokenProps{
    handleClick: (value: Token) => void;
    associatedButtons: Token[];
}

const AssociateNewToken = ({associatedButtons, handleClick}: IAssociateNewTokenProps) => {
    return <>
        {associatedButtons.map((e: Token, indexButton) => <div key={indexButton} className={'associate-button'}>
        <button onClick={() => handleClick(e)} className={'associate-button__button'}>Associate {e.symbol} ({e.address})
        <span>Token is not associated with your account</span></button>
    </div>)}
        </>
}

export default AssociateNewToken
