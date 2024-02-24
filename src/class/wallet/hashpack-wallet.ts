import { HashConnect } from 'hashconnect';
import { AccountBalanceQuery, Client, TokenAssociateTransaction } from '@hashgraph/sdk';
import { NETWORK } from '../../config';

export class HashpackWallet {
    name = 'hashpack';
    address = '';
    connectionData: any = null;
    signer: any = null;
    appMetadata = {
        name: "EtaSwap",
        description: "DEX aggregator",
        icon: "https://etaswap.com/logo-bg.svg",
    };
    hashconnect: any;
    setWallet: any;
    associatedTokens: any[] | null = null;

    constructor(setWallet: any) {
        this.hashconnect = new HashConnect();
        this.setWallet = setWallet;

        this.hashconnect.pairingEvent.on((pairingData: any) => {
            this.connectionData = pairingData;
            this.address = this.connectionData?.accountIds?.[0];
            const provider = this.hashconnect.getProvider(NETWORK, pairingData?.topic, this.address);
            this.signer = this.hashconnect.getSigner(provider);
            this.refreshWallet();
        });
    }

    refreshWallet() {
        this.setWallet({
            name: this.name,
            address: this.address,
            signer: this.signer,
            associatedTokens: this.associatedTokens,
            auth: this.auth.bind(this),
            signTransaction: this.signTransaction.bind(this),
            executeTransaction: this.executeTransaction.bind(this),
        });
    }

    async connect(onLoad = false) {
        const initData = await this.hashconnect.init(this.appMetadata, NETWORK, true);
        if (initData?.savedPairings?.[0]?.network === NETWORK) {
            //reload page
            this.connectionData = initData?.savedPairings?.[0];
            this.address = this.connectionData?.accountIds?.[0];
            const provider = this.hashconnect.getProvider(NETWORK, initData?.topic, initData?.savedPairings?.[0]?.accountIds?.[0]);
            this.signer = this.hashconnect.getSigner(provider);
            const balance = await this.signer.getAccountBalance();
            this.associatedTokens = balance.tokens?._map;
            this.refreshWallet();
        } else if (!onLoad) {
            //new connection
            await this.hashconnect.disconnect(this.connectionData?.topic);
            await this.hashconnect.clearConnectionsAndData();
            await this.hashconnect.init(this.appMetadata, NETWORK, true);
            this.hashconnect.connectToLocalWallet();
        }
    }

    async updateBalance() {
        if(this.hashconnect) {
            const client = NETWORK === 'testnet' ? Client.forTestnet() : Client.forMainnet();
            const tokens = await new AccountBalanceQuery().setAccountId(this.address).execute(client);
            this.associatedTokens = tokens.toJSON().tokens;
        }else {
            this.associatedTokens = null;
        }
        this.refreshWallet();
    }

    async associateNewToken(tokenAddress: string | null) {
        if(!tokenAddress){
            return;
        }
        try {
            const associateTx = new TokenAssociateTransaction();
            associateTx.setTokenIds([tokenAddress]);
            associateTx.setAccountId(this.signer.accountToSign);
            await associateTx.freezeWithSigner(this.signer);
            const result: any = await this.executeTransaction(associateTx);
            this.refreshWallet();
            return result;
        } catch (error) {
            this.refreshWallet();
            return {error: 'ERROR'};
        }
    }

    async auth({ serverAddress, serverSignature, originalPayload }: any) {
        const authRes = await this.hashconnect.authenticate(
            this.connectionData?.topic,
            this.address,
            serverAddress,
            serverSignature,
            originalPayload
        );

        return authRes?.userSignature;
    }

    async signTransaction(transaction: any) {
        const res = await this.hashconnect.sendTransaction(
            this.connectionData?.topic,
            {
                topic: this.connectionData?.topic,
                byteArray: new Uint8Array(transaction.toBytes()),
                metadata: {
                    accountToSign: this.address,
                    returnTransaction: true,
                    hideNft: false,
                },
            },
        );

        return res.signedTransaction;
    }

    async executeTransaction(transaction: any) {
        const res = await this.hashconnect.sendTransaction(
            this.connectionData?.topic,
            {
                topic: this.connectionData?.topic,
                byteArray: new Uint8Array(transaction.toBytes()),
                metadata: {
                    accountToSign: this.address,
                    hideNft: false,
                },
            },
        );

        return {
            error: res.success ? null : (res.error?.message || res.error.toString()),
            res: res.response,
        }
    }

    async disconnect() {
        await this.hashconnect.disconnect(this.connectionData?.topic);
        await this.hashconnect.clearConnectionsAndData();
        this.connectionData = null;
        this.signer = null;
        this.address = '';
        this.refreshWallet();
    }

}
