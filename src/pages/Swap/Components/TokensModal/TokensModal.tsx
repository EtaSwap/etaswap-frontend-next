import { Input, Modal } from "antd";
import { useEffect } from "react";
import { IToken } from "../../../../models";

export function TokensModal({
                                isOpen,
                                setSearchPhrase,
                                searchPhrase,
                                modifyToken,
                                setIsOpen,
                                hiddenTokens,
                                tokens,
                                network,
                                setHiddenTokens,
                                providers
                            }: any) {

    useEffect(() => {
        const lowerCase = searchPhrase.toLowerCase();
        const hiddenTokens: any = [];
        if (lowerCase) {
            tokens.forEach((token: IToken, i: any) => {
                if (
                    !token.symbol.toLowerCase().includes(lowerCase)
                    && !token.name.toLowerCase().includes(lowerCase)
                    && !token.address.toLowerCase().includes(lowerCase)
                ) {
                    hiddenTokens.push(i);
                }
            });
        }
        setHiddenTokens(hiddenTokens);
    }, [searchPhrase]);


    return <Modal open={isOpen} footer={null} onCancel={() => {
        setIsOpen(false)
    }} title="Select a token">
        <div className='modalContent'>
            <div className="token__search">
                <Input
                    type='search'
                    className='token__search-field'
                    placeholder='Search by name, address, symbol'
                    onChange={(e) => setSearchPhrase(e.target.value)}
                    value={searchPhrase}
                />
            </div>
            <div className='token__list'>
                {tokens?.map((token: IToken, index: any) => {
                    return (
                        <div
                            className={'tokenChoice' + (hiddenTokens.includes(index) ? ' hidden' : '')}
                            key={index}
                            onClick={() => modifyToken(index)}
                        >
                            <img src={token?.icon || ''} alt={token.symbol} className="tokenLogo"/>
                            <div className='tokenChoiceNames'>
                                <div className='tokenName'>
                                    {token.name}
                                </div>
                                <div className='tokenTicker'>
                                    {token.symbol} ({token.address})
                                </div>
                            </div>
                            <div className='tokenChoiceProviders'>
                                {token.providers.map((provider: string) => {
                                    if (providers?.[provider]?.icon) {
                                        return <img src={providers[provider].icon} alt={provider} key={provider}/>
                                    }
                                })}
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    </Modal>
}
