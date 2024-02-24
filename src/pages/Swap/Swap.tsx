import { Input, message } from 'antd'
import { ArrowDownOutlined } from '@ant-design/icons'
import { useEffect, useRef, useState } from 'react'
import { BigNumber, ethers } from 'ethers';
import {
    AccountAllowanceApproveTransaction,
    ContractExecuteTransaction,
    ContractFunctionParameters,
    TokenBalanceJson,
    Transaction,
    TransferTransaction,
} from '@hashgraph/sdk';
import axios from 'axios';
import { SmartNodeSocket } from '../../class/smart-node-socket';
import { useLoader } from "../../components/Loader/LoaderContext";
import { useToaster } from "../../components/Toaster/ToasterContext";
import { sortTokens } from "./swap.utils";
import { SlippageTolerance } from "./Components/SlippageTolerance/SlippageTolerance";
import { TokensModal } from "./Components/TokensModal/TokensModal";
import { toastTypes } from "../../models/Toast";
import { Token } from '../../types/token';
import { Provider } from '../../class/providers/provider';
import { IAssociatedButton, typeWallet } from "../../models";
import useDebounce from "../../hooks/useDebounce";
import { SortedPrice } from '../../types/sorted-price';
import {
    DEFAULT_TOKENS,
    EXCHANGE_ADDRESS,
    HSUITE_NODES,
    HSUITE_TOKEN_ADDRESS,
    MIRRORNODE,
    WHBAR_LIST
} from '../../config';
import { AggregatorId } from '../../class/providers/types/props';
import AssociateNewToken from './Components/AssociateNewToken/AssociateNewToken';

export interface ISwapProps {
    wallet: any;
    tokens: Map<string, Token>;
    rate: number | null;
    providers: Record<string, Provider>;
}

function Swap({ wallet, tokens: tokensMap, rate, providers }: ISwapProps) {
    const { showLoader, hideLoader } = useLoader();
    const { showToast } = useToaster();

    const tokens = sortTokens(tokensMap);
    const [tokenOneAmountInput, setTokenOneAmountInput] = useState<string>('0');
    const [tokenTwoAmountInput, setTokenTwoAmountInput] = useState<string>('0');
    const [tokenOneAmount, setTokenOneAmount] = useState<string>('0');
    const [tokenTwoAmount, setTokenTwoAmount] = useState<string>('0');
    const [tokenOne, setTokenOne] = useState(tokens[DEFAULT_TOKENS[0]]);
    const [tokenTwo, setTokenTwo] = useState(tokens[DEFAULT_TOKENS[1]]);

    const debouncedTokenOneAmountInput: string = useDebounce(tokenOneAmountInput, 500);
    const debouncedTokenTwoAmountInput: string = useDebounce(tokenTwoAmountInput, 500);
    const [associatedButtons, setAssociatedButtons] = useState<Token[]>([]);
    const [slippage, setSlippage] = useState(1);
    const [feeOnTransfer, setFeeOnTransfer] = useState<boolean>(false);
    const [messageApi, contextHolder] = message.useMessage()
    const [isOpen, setIsOpen] = useState(false)
    const [checkAllRatesOpen, setCheckAllRatesOpen] = useState(true);
    const [changeToken, setChangeToken] = useState<any>(1)
    const refreshCount = useRef(0);
    const refreshTimer = useRef<any>(0);
    const [isRefreshAnimationActive, setIsRefreshAnimationActive] = useState(false);
    const [searchPhrase, setSearchPhrase] = useState('');
    const [hiddenTokens, setHiddenTokens] = useState([]);
    const [sortedPrices, setSortedPrices] = useState<SortedPrice[]>([]);

    const smartNodeSocket = async () => {
        return new Promise(async (resolve, reject) => {
            if (!wallet?.address) {
                return null;
            }
            try {
                showLoader();
                let randomNode = HSUITE_NODES[Math.floor(Math.random() * HSUITE_NODES.length)];
                let nodeSocket: any = new SmartNodeSocket(randomNode, wallet.address, providers.HSuite.getApiKey());

                nodeSocket.getSocket('gateway').on('connect', async () => {
                    console.log(`account ${wallet.address} connected to node ${nodeSocket.getNode().operator}`);
                });

                nodeSocket.getSocket('gateway').on('disconnect', async () => {
                    console.log(`account ${wallet.address} disconnected from node ${nodeSocket.getNode().operator}`);
                });

                nodeSocket.getSocket('gateway').on('errors', async (event: any) => {
                    console.error('error event', event);
                });

                nodeSocket.getSocket('gateway').on('authenticate', async (event: any) => {
                    if (event.isValidSignature) {
                        resolve({
                            message: `account ${wallet.address} authenticated to node ${nodeSocket.getNode().operator}, ready to operate with websockets/write operations...`,
                            socket: nodeSocket
                        })
                    } else {
                        reject(new Error(`account ${wallet.address} can't connect to node ${nodeSocket.getNode().operator}, shit happens...`))
                    }
                });

                nodeSocket.getSocket('gateway').on('authentication', async (event: any) => {
                    let payload = {
                        serverSignature: new Uint8Array(event.signedData.signature),
                        originalPayload: event.payload
                    };

                    const walletSignature = await wallet.auth({
                        serverAddress: randomNode.operator,
                        serverSignature: payload.serverSignature,
                        originalPayload: payload.originalPayload,
                    });

                    nodeSocket.getSocket('gateway').emit('authenticate', {
                        signedData: {
                            signedPayload: payload,
                            userSignature: walletSignature,
                        },
                        walletId: wallet.address,
                    });
                });

                hideLoader();
                nodeSocket.getSocket('gateway').connect();
            } catch (error) {
                hideLoader();
                reject(error);
            }
        });
    }

    const handleSlippage = (e: any) => {
        setSlippage(e.target.value);
    }

    const changeAmountOne = (e: any) => {
        if (feeOnTransfer) {
            setFeeOnTransfer(false);
        }
        const input = e.target.value;
        if (input.match(/^[0-9]{0,10}(?:\.[0-9]{0,8})?$/)) {
            setTokenOneAmountInput(input ? (['.', '0'].includes(input.charAt(input.length - 1)) ? input : parseFloat(input).toString()) : '0');
        }
    }


    const changeAmountTwo = (e: any) => {
        if (!feeOnTransfer) {
            setFeeOnTransfer(true);
        }
        const input = e.target.value;
        if (input.match(/^[0-9]{0,10}(?:\.[0-9]{0,8})?$/)) {
            setTokenTwoAmountInput(input ? (['.', '0'].includes(input.charAt(input.length - 1)) ? input : parseFloat(input).toString()) : '0');
        }
    }

    const switchTokens = () => {
        setTokenOneAmountInput('0');
        setTokenTwoAmountInput('0');
        setTokenOneAmount('0');
        setTokenTwoAmount('0');
        setTokenOne(tokenTwo);
        setTokenTwo(tokenOne);
        // fetchDexSwap(tokenTwo.solidityAddress, tokenOne.solidityAddress)
    }

    const openModal = (token: number) => {
        setChangeToken(token);
        setIsOpen(true);
    }

    const modifyToken = (i: any) => {
        setTokenOneAmountInput('0');
        setTokenTwoAmountInput('0');
        setTokenOneAmount('0');
        setTokenTwoAmount('0');
        if (changeToken === 1) {
            setTokenOne(tokens[i]);
            // fetchDexSwap(tokens[i].solidityAddress, tokenTwo.solidityAddress)
        } else {
            setTokenTwo(tokens[i]);
            // fetchDexSwap(tokenOne.solidityAddress, tokens[i].solidityAddress)
        }
        setIsOpen(false);
        setSearchPhrase('');
    }

    const convertPrice = (price: any) => {
        if (!price || !tokenOne || !tokenTwo) {
            return '0';
        }
        const decimalsDiff = tokenOne.decimals - tokenTwo.decimals;
        return ethers.utils.formatEther(decimalsDiff > 0 ? price.mul(Math.pow(10, decimalsDiff)) : price.div(Math.pow(10, Math.abs(decimalsDiff))));
    }

    const switchAllRates = () => {
        setCheckAllRatesOpen(!checkAllRatesOpen);
    }

    const fetchDex = async () => {
        const deadline = Math.floor(Date.now() / 1000) + 1000;

        const bestRate = sortedPrices?.[0];
        if (!bestRate?.price || bestRate.price.eq(0)) {
            messageApi.open({
                type: 'error',
                content: 'Failed to fetch rate',
                duration: 2
            });
            return;
        }

        if (bestRate.aggregatorId === AggregatorId.HSuite) {
            showLoader();
            const socketConnection: any = await smartNodeSocket();
            socketConnection.socket.getSocket('gateway').on('swapPoolRequest', async (resPool: any) => {
                try {
                    if (resPool.status === 'success') {
                        let transaction: TransferTransaction = Transaction.fromBytes(new Uint8Array(resPool.payload.transaction)) as TransferTransaction;
                        const minToReceive = ethers.utils.parseUnits(tokenTwoAmount, tokenTwo.decimals).mul(1000 - slippage * 10).div(1000);
                        let amountTo: BigNumber;
                        if (tokenTwo.solidityAddress === ethers.constants.AddressZero) {
                            amountTo = BigNumber.from(transaction.hbarTransfers.get(wallet.address)?.toTinybars()?.toString() || 0);
                            if (amountTo.lt(minToReceive)) {
                                throw new Error('Unexpected receive amount');
                            }
                        } else {
                            amountTo = BigNumber.from(transaction.tokenTransfers.get(tokenTwo.address)?.get(wallet.address)?.toString() || 0);
                            if (amountTo.lt(minToReceive)) {
                                throw new Error('Unexpected receive amount');
                            }
                        }


                        let signedTransactionBytes = await wallet.signTransaction(transaction);

                        socketConnection.socket.getSocket('gateway').on('swapPoolExecute', (responseEvent: any) => {
                            if (responseEvent.status === 'success') {
                                showToast('Transaction', `The transaction was successfully processed. Transaction ID: ${responseEvent.payload?.transaction?.transactionId}`, toastTypes.success);
                                socketConnection.socket.getSocket('gateway').disconnect();
                            } else {
                                console.error(responseEvent);
                                showToast('Transaction', 'Unexpected error', toastTypes.error);
                            }
                        });

                        socketConnection.socket.getSocket('gateway').emit('swapPoolExecute', {
                            type: 'swapPoolExecute',
                            transactionBytes: signedTransactionBytes,
                        }, (error: any) => {
                            if (error) {
                                console.error(error);
                                showToast('Transaction', 'Unexpected error', toastTypes.error);
                            }
                        });
                    } else {
                        console.error(resPool.error);
                        showToast('Transaction', resPool.error, toastTypes.error);
                    }
                } catch (e) {
                    console.error(e);
                    showToast('Transaction', 'Unexpected error', toastTypes.error);
                }
            });

            let amountFromHsuite = ethers.utils.parseUnits(tokenOneAmount, tokenOne.decimals);
            if (tokenOne.solidityAddress === ethers.constants.AddressZero) {
                amountFromHsuite = amountFromHsuite.mul(1000 - providers[bestRate.name].feePromille).div(1000);
            } else if (tokenOne.symbol === 'HSUITE') {
                const hSuiteFee = Math.max(10000, amountFromHsuite.mul(providers[bestRate.name].feeDEXPromille).div(1000).toNumber());
                amountFromHsuite = amountFromHsuite.sub(hSuiteFee);
            }

            let swapObj = {
                baseToken: {
                    details: {
                        id: tokenOne.solidityAddress === ethers.constants.AddressZero ? 'HBAR' : tokenOne.address,
                        symbol: tokenOne.symbol,
                        decimals: tokenOne.decimals,
                    },
                    amount: {
                        value: ethers.utils.formatUnits(
                            amountFromHsuite,
                            tokenOne.decimals
                        )
                    }
                },
                swapToken: {
                    details: {
                        id: tokenTwo.solidityAddress === ethers.constants.AddressZero ? 'HBAR' : tokenTwo.address,
                        symbol: tokenTwo.symbol,
                        decimals: tokenTwo.decimals,
                    },
                    amount: {
                        value: ethers.utils.formatUnits(
                            ethers.utils.parseUnits(tokenTwoAmount, tokenTwo.decimals),
                            tokenTwo.decimals
                        )
                    }
                },
            };

            socketConnection.socket.getSocket('gateway').emit('swapPoolRequest', {
                type: 'swapPoolRequest',
                senderId: wallet.address,
                swap: swapObj
            });
        } else {
            showLoader();
            if (!WHBAR_LIST.includes(tokenOne.solidityAddress)) {
                const allowanceTx = await new AccountAllowanceApproveTransaction()
                    .approveTokenAllowance(
                        tokenOne.address,
                        wallet?.address,
                        EXCHANGE_ADDRESS,
                        // @ts-ignore
                        feeOnTransfer
                            ? ethers.utils.parseUnits(tokenOneAmount, tokenOne.decimals).mul(1000 + slippage * 10).div(1000).toString()
                            : ethers.utils.parseUnits(tokenOneAmount, tokenOne.decimals).toString(),
                    )
                    .freezeWithSigner(wallet.signer);

                try {
                    const approveTransaction = await wallet.executeTransaction(allowanceTx);
                    if (approveTransaction.error) {
                        showToast('Transaction', approveTransaction.error, toastTypes.error);
                        throw approveTransaction.error;
                    }
                } catch (e) {
                    hideLoader();
                    throw e;
                }

            }

            //prevent double-firing approval event on HashPack
            await new Promise(resolve => setTimeout(resolve, 500));

            let swapTransaction = await new ContractExecuteTransaction()
                .setContractId(EXCHANGE_ADDRESS)
                .setGas(bestRate.gas)
                .setFunction('swap', new ContractFunctionParameters()
                    .addString(bestRate.aggregatorId)
                    .addString(bestRate.path)
                    .addUint256(
                        // @ts-ignore
                        feeOnTransfer
                            ? ethers.utils.parseUnits(tokenOneAmount, tokenOne.decimals).mul(1000 + slippage * 10).div(1000).toString()
                            : ethers.utils.parseUnits(tokenOneAmount, tokenOne.decimals).toString()
                    )
                    .addUint256(
                        // @ts-ignore
                        feeOnTransfer
                            ? ethers.utils.parseUnits(tokenTwoAmount, tokenTwo.decimals).toString()
                            : ethers.utils.parseUnits(tokenTwoAmount, tokenTwo.decimals).mul(1000 - slippage * 10).div(1000).toString()
                    )
                    .addUint256(deadline)
                    .addBool(WHBAR_LIST.includes(tokenOne.solidityAddress))
                    .addBool(feeOnTransfer)
                )
                .setPayableAmount(WHBAR_LIST.includes(tokenOne.solidityAddress)
                    ? (feeOnTransfer
                            ? ethers.utils.formatUnits(ethers.utils.parseUnits(tokenOneAmount, 8).mul(1000 + slippage * 10).div(1000), 8)
                            : ethers.utils.formatUnits(ethers.utils.parseUnits(tokenOneAmount, 8), 8)
                    )
                    : 0)
                .freezeWithSigner(wallet.signer);

            let execTransaction: any = null;
            try {
                execTransaction = await wallet.executeTransaction(swapTransaction);
                if (execTransaction.error) {
                    showToast('Transaction', execTransaction.error, toastTypes.error);
                    throw execTransaction.error;
                }
            } catch (e) {
                hideLoader();
                throw e;
            }

            if (execTransaction.res?.transactionId) {
                const idTransaction = `${execTransaction.res.transactionId.substr(0, 4)}${execTransaction.res.transactionId.substr(4).replace(/@/, '-').replace('.', '-')}`;
                setTimeout(() => {
                    axios.get(`${MIRRORNODE}/api/v1/transactions/${idTransaction}`).then(res => {
                        if (res?.data?.transactions?.[0]?.result) {
                            showToast('Transaction', `The transaction was successfully processed. Transaction ID: ${execTransaction.res.transactionId}`, toastTypes.success);
                        } else {
                            showToast('Transaction', 'Error on processing transaction', toastTypes.error);
                        }
                    }).finally(() => {
                        hideLoader();
                    });
                }, 6000);
            } else {
                console.error('Empty/incorrect transaction response');
                showToast('Transaction', 'Unexpected error', toastTypes.error);
            }
        }

        setTokenOneAmountInput('0');
        setTokenTwoAmountInput('0');
        setTokenOneAmount('0');
        setTokenTwoAmount('0');
    }

    const getBestPriceDescr = () => {
        const bestPrice = sortedPrices?.[0];
        return parseFloat(convertPrice(bestPrice?.price))?.toFixed(6);
    }

    const swapAvailable = () => {
        const bestPrice = sortedPrices?.[0];
        let allTokensAssociated = true;
        if (wallet.associatedTokens && tokenOne && tokenTwo) {
            if (!(wallet.associatedTokens.has(tokenOne.address) || tokenOne.symbol === typeWallet.HBAR) ||
                !(wallet.associatedTokens.has(tokenTwo.address) || tokenTwo.symbol === typeWallet.HBAR)) {
                allTokensAssociated = false;
            }
            const isHSuiteRequired = sortedPrices?.length > 0 ? sortedPrices[0].aggregatorId === AggregatorId.HSuite : false;
            const hSuiteToken = tokens.find(token => token.solidityAddress === HSUITE_TOKEN_ADDRESS);
            if (isHSuiteRequired && !(wallet.associatedTokens?.has(hSuiteToken.address))) {
                allTokensAssociated = false;
            }
        }

        return tokenOneAmount
            && allTokensAssociated
            && wallet.address
            && bestPrice?.amountIn
            && bestPrice?.amountOut;
    }

    const getNetworkFee = () => {
        const bestPrice = sortedPrices?.[0];
        if (!rate || !tokenOne || !tokenTwo || !bestPrice?.aggregatorId) {
            return 0;
        }
        if (bestPrice.aggregatorId === AggregatorId.HSuite) {
            return rate * 0.0016;
        }
        const approxCost1Gas = 0.000000082;
        return rate * bestPrice.gas * approxCost1Gas;
    }

    const fetchPrices = (): void => {
        //TODO: fetch prices by backend API
        setTimeout(() => {
            setSortedPrices([{
                transactionType: 'SWAP',
                aggregatorId: 'HSuite',
                path: '0x000100101',
                amountIn: BigNumber.from('2400000000'),
                amountOut: BigNumber.from('4000000000'),
                gas: 200000,
            }, {
                transactionType: 'SWAP',
                aggregatorId: 'SaucerSwapV1',
                path: '0x0001001014894874874873931111119494949499991111',
                amountIn: BigNumber.from('2400000000'),
                amountOut: BigNumber.from('3900000000'),
                gas: 400000,
            }] as any);
        }, 700);
    }

    const refreshRate = () => {
        setIsRefreshAnimationActive(false);
        refreshCount.current = refreshCount.current + 2;
        if (
            tokenOne?.solidityAddress
            && tokenTwo?.solidityAddress
            && (feeOnTransfer ? tokenTwoAmount : tokenOneAmount) !== '0'
        ) {
            fetchPrices();
        }
        setTimeout(() => setIsRefreshAnimationActive(true), 0);
        refreshTimer.current = setTimeout(refreshRate, (25000 + 30 * refreshCount.current * refreshCount.current));
    };

    const associateToken = async (token: Token) => {
        showLoader();
        const result = await wallet.associateNewToken(token.address);

        if (result) {
            if (result.error) {
                if (result.error === "USER_REJECT") {
                    showToast('Associate Token', `Token ${token.name} association was rejected.`, toastTypes.error);
                } else if (result.error.includes('precheck with status')) {
                    showToast('Associate token', result.error, toastTypes.error);
                } else if (result.error.includes('TOKEN_ALREADY_ASSOCIATED_TO_ACCOUNT')) {
                    // "receipt for transaction 0.0.5948290@1703145822.184660155 contained error status TOKEN_ALREADY_ASSOCIATED_TO_ACCOUNT"
                    showToast('Associate Token', result.error, toastTypes.error);
                } else {
                    showToast('Error', `An unknown error occurred`, toastTypes.error);
                }
            } else if (result?.res?.nodeId) {
                showToast('Associate Token', `Token ${token.name} associated to account`, toastTypes.success);
            }
        } else {
            showToast('Error', `An unknown error occurred.`, toastTypes.error);
        }
        wallet.updateBalance(true);
        checkAssociateTokens();
        hideLoader();
    }

    const checkAssociateTokens = () => {
        if (wallet && wallet.signer === null) {
            setAssociatedButtons([]);
            return;
        }
        if (wallet.associatedTokens && tokenOne?.solidityAddress && tokenTwo?.solidityAddress) {
            const isHSuiteRequired = sortedPrices?.length > 0 ? sortedPrices[0].aggregatorId === AggregatorId.HSuite : false;
            const hSuiteToken = tokens.find(token => token.solidityAddress === HSUITE_TOKEN_ADDRESS);
            let tokensToAssociate: Token[] = [];
            if (!(wallet.associatedTokens?.has(tokenOne.address)) && tokenOne.symbol !== typeWallet.HBAR) {
                tokensToAssociate.push({ ...tokenOne });
            }
            if (!(wallet.associatedTokens?.has(tokenTwo.address)) && tokenTwo.symbol !== typeWallet.HBAR) {
                tokensToAssociate.push({ ...tokenTwo });
            }
            const isHSuiteInList = !!tokensToAssociate.find(token => token.solidityAddress === HSUITE_TOKEN_ADDRESS);
            if (!isHSuiteInList && isHSuiteRequired) {
                if (!(wallet.associatedTokens?.has(hSuiteToken.address))) {
                    tokensToAssociate.push(hSuiteToken);
                }
            }
            setAssociatedButtons(filterUniqueTokens(tokensToAssociate));
        }
    }

    const filterUniqueTokens = (tokens: Token[]) => {
        const result = tokens.reduce((acc: Token[], current: Token) => {
            const x = acc.find(item => item.address === current.address);
            if (!x) {
                return acc.concat([current]);
            } else {
                return acc;
            }
        }, []);
        return result;
    }

    useEffect(() => {
        if (!feeOnTransfer && tokenOneAmountInput === '0') {
            setTokenTwoAmountInput('0');
            setTokenTwoAmount('0');
            setSortedPrices([]);
        } else if (!feeOnTransfer && tokenOne?.solidityAddress && tokenTwo?.solidityAddress) {
            fetchPrices();
        }
        checkAssociateTokens();
    }, [tokenOneAmount]);

    useEffect(() => {
        if (feeOnTransfer && tokenTwoAmount === '0') {
            setTokenOneAmountInput('0');
            setTokenOneAmount('0');
            setSortedPrices([]);
        } else if (feeOnTransfer && tokenOne?.solidityAddress && tokenTwo?.solidityAddress) {
            fetchPrices();
        }
        checkAssociateTokens();
    }, [tokenTwoAmount]);

    useEffect(() => {
        if (feeOnTransfer) {
            const bestAmountIn = sortedPrices?.[0]?.amountIn?.toString();
            if (tokenTwoAmount && bestAmountIn) {
                setTokenOneAmountInput(ethers.utils.formatUnits(bestAmountIn, tokenOne?.decimals));
            } else {
                setTokenOneAmountInput('0');
            }
        } else {
            const bestAmountOut = sortedPrices?.[0]?.amountOut?.toString();
            if (tokenOneAmount && bestAmountOut) {
                setTokenTwoAmountInput(ethers.utils.formatUnits(bestAmountOut, tokenTwo?.decimals));
            } else {
                setTokenTwoAmountInput('0');
            }
        }
    }, [sortedPrices]);

    useEffect(() => {
        setTokenTwoAmount(debouncedTokenTwoAmountInput);
    }, [debouncedTokenTwoAmountInput]);

    useEffect(() => {
        setTokenOneAmount(debouncedTokenOneAmountInput);
    }, [debouncedTokenOneAmountInput]);

    useEffect(() => {
        setTokenOne(tokens[DEFAULT_TOKENS[0]]);
        setTokenTwo(tokens[DEFAULT_TOKENS[1]]);
    }, [tokensMap]);

    useEffect(() => {
        setTokenOneAmountInput('0');
        setTokenTwoAmountInput('0');
        setTokenOneAmount('0');
        setTokenTwoAmount('0');
    }, [wallet, tokensMap]);


    useEffect(() => {
        checkAssociateTokens();
        setIsRefreshAnimationActive(false);
        clearTimeout(refreshTimer.current);
        refreshCount.current = 0;
        if (tokenOne?.solidityAddress && tokenTwo?.solidityAddress) {
            setTimeout(() => setIsRefreshAnimationActive(true), 1500);
        }
        refreshTimer.current = setTimeout(refreshRate, 25000 + 1500);
    }, [tokenOne, tokenTwo]);

    useEffect(() => {
        checkAssociateTokens();
    }, [wallet]);

    return (
        <>
            {contextHolder}
            <TokensModal
                hiddenTokens={hiddenTokens}
                modifyToken={modifyToken}
                tokens={tokens}
                isOpen={isOpen}
                setIsOpen={setIsOpen}
                searchPhrase={searchPhrase}
                setSearchPhrase={setSearchPhrase}
                setHiddenTokens={setHiddenTokens}
                providers={providers}
            />
            <div className='tradeBox'>
                <div className='tradeBoxHeader'>
                    <h4>Swap</h4>
                    <SlippageTolerance handleSlippage={handleSlippage} slippage={slippage}/>
                </div>
                <div className='inputs'>
                    <div className={feeOnTransfer ? 'approx' : ''}>
                        <Input
                            placeholder='0'
                            value={tokenOneAmountInput}
                            onChange={changeAmountOne}
                        />
                    </div>
                    <div className={feeOnTransfer ? '' : 'approx'}>
                        <Input
                            placeholder='0'
                            value={tokenTwoAmountInput}
                            onChange={changeAmountTwo}
                        />
                    </div>
                    <div className="switchButton" onClick={switchTokens}>
                        <ArrowDownOutlined className='switchArrow'/>
                    </div>
                    <div className='assetOne' onClick={() => openModal(1)}>
                        <img src={tokenOne?.icon} alt="assetOnelogo" className='logo'/>
                        {tokenOne?.symbol}
                    </div>
                    <div className='assetTwo' onClick={() => openModal(2)}>
                        <img src={tokenTwo?.icon} alt="assetTwologo" className='logo'/>
                        {tokenTwo?.symbol}
                    </div>
                </div>

                <AssociateNewToken handleClick={associateToken} associatedButtons={associatedButtons}/>

                <div className='ratesLogoWrapper'>
                    <div className='ratesLogoInner'>
                        <span className='ratesLogoTop'>Best rate: {getBestPriceDescr()}</span>
                        <button className='ratesLogoToggle'
                                onClick={() => switchAllRates()}>{checkAllRatesOpen ? 'Hide all rates' : 'Show all rates'}</button>
                    </div>
                    {checkAllRatesOpen
                        ? sortedPrices.map(({ aggregatorId, amountIn, amountOut }: any) =>
                            <div
                                className='ratesLogo' key={aggregatorId}>
                                <img className='ratesLogoIcon' title={aggregatorId} src={providers[aggregatorId].icon}
                                     alt={aggregatorId}/> {ethers.utils.formatUnits(feeOnTransfer ? amountIn : amountOut, feeOnTransfer ? tokenOne?.decimals : tokenTwo.decimals)}
                            </div>)
                        : ''
                    }
                </div>
                {(tokenOneAmount !== '0' && tokenTwoAmount !== '0')
                    ? feeOnTransfer
                        ? <div>Max to
                            sell: {ethers.utils.formatUnits(ethers.utils.parseUnits(tokenOneAmount, tokenOne.decimals).mul(1000 + slippage * 10).div(1000).toString(), tokenOne.decimals)}</div>
                        : <div>Min
                            receive: {ethers.utils.formatUnits(ethers.utils.parseUnits(tokenTwoAmount, tokenTwo.decimals).mul(1000 - slippage * 10).div(1000).toString(), tokenTwo.decimals)}</div>
                    : ''
                }
                <div className='networkFee'>Network fee: ≈{getNetworkFee().toFixed(4)} HBAR</div>
                <div className="refreshTicker">
                    <div className={isRefreshAnimationActive ? 'active' : ''}
                         style={{ animationDuration: parseInt(String((25000 + 30 * refreshCount.current * refreshCount.current) / 1000)) + 's' }}></div>
                </div>

                <button className='swapButton' onClick={fetchDex} disabled={!swapAvailable()}>Swap</button>
            </div>
        </>
    )
}

export default Swap
