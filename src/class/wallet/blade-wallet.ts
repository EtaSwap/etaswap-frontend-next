import { BladeConnector, ConnectorStrategy } from '@bladelabs/blade-web3.js';

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
    network: any;

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

    async connect(network: any, onLoad = false) {
        this.network = network;
        if (!this.bladeConnector) {
            this.bladeConnector = await BladeConnector.init(
                ConnectorStrategy.AUTO,
                this.appMetadata,
            );
        }
        const accountIds = await this.bladeConnector.createSession({ network });
        this.address = accountIds?.[0];
        this.signer = this.bladeConnector.getSigner();

        this.refreshWallet();
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
        const res =  await transaction.executeWithSigner(this.signer);

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
