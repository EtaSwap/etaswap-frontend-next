import { BladeConnector, ConnectorStrategy } from '@bladelabs/blade-web3.js';
import { NETWORK } from '../../config';
import { AccountBalanceQuery, Client, TokenAssociateTransaction, TokenBalanceJson } from '@hashgraph/sdk';

export class BladeWallet {
    name = 'blade';
    address = '';
    signer: any = null;
    appMetadata: any = {
        name: "EtaSwap",
        description: "DEX aggregator",
        url: "https://etaswap.com",
        icons: ["https://etaswap.com/logo-bg.svg"]
    };
    bladeConnector: any = null;
    setWallet: any;
    associatedTokens: TokenBalanceJson[] | null = null;

    constructor(setWallet: any) {
        this.setWallet = setWallet;
    }

    refreshWallet() {
        this.setWallet({
            name: this.name,
            address: this.address,
            signer: this.signer,
            auth: this.auth.bind(this),
            signTransaction: this.signTransaction.bind(this),
            executeTransaction: this.executeTransaction.bind(this),
        });
    }

    async connect(onLoad = false) {
        if (!this.bladeConnector) {
            this.bladeConnector = await BladeConnector.init(
                ConnectorStrategy.AUTO,
                this.appMetadata,
            );
        }
        const accountIds = await this.bladeConnector.createSession({ network: NETWORK });
        this.address = accountIds?.[0];
        this.signer = this.bladeConnector.getSigner();

        this.refreshWallet();
    }

    async updateBalance(isDelay = false) {
        if (isDelay) {
            setTimeout(async () => {
                await this.getBalance();
            }, 3000);
        } else {
            await this.getBalance();
        }
    }

    getBalance = async () => {
        if (this.bladeConnector) {
            const client = NETWORK === 'testnet' ? Client.forTestnet() : Client.forMainnet();
            const tokens = await new AccountBalanceQuery().setAccountId(this.address).execute(client);
            this.associatedTokens = tokens.toJSON().tokens;
        } else {
            this.associatedTokens = null;
        }
        this.refreshWallet();
    }

    async associateNewToken(tokenAddress: string | null) {
        if (!tokenAddress) {
            return;
        }
        try {
            const associateTx = new TokenAssociateTransaction();
            associateTx.setTokenIds([tokenAddress]);
            associateTx.setAccountId(this.signer.accountId.toString());
            await associateTx.freezeWithSigner(this.signer);
            const result: any = await this.executeTransaction(associateTx);
            this.refreshWallet();
            return result;
        } catch (error) {
            this.refreshWallet();
            return null;
        }
    }

    async auth({ serverAddress, serverSignature, originalPayload }: any) {
        const payload = { serverSignature, originalPayload };
        const signRes = await this.signer.sign([new Uint8Array(Buffer.from(JSON.stringify(payload)))]);

        return signRes?.[0]?.signature;
    }

    async signTransaction(transaction: any) {
        const res = await this.signer.signTransaction(transaction);
        return res.toBytes();
    }

    async executeTransaction(transaction: any) {
        const res = await transaction.executeWithSigner(this.signer);

        console.log(res);
        return {
            error: res.success ? null : res.error,
            res: res.response,
        }
    }

    async disconnect() {
        this.signer = null;
        this.address = '';
        await this.bladeConnector.killSession();
        this.refreshWallet();
    }

}
