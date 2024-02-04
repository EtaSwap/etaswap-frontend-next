import { io } from 'socket.io-client';

export class SmartNodeSocket {
    node: any = null;
    wallet = null;
    socket: any = null;
    apiKey = null;

    constructor(node: any, wallet: any, apiKey: any) {
        this.node = node;
        this.wallet = wallet;
        this.apiKey = apiKey;
    }

    getNode() {
        return this.node;
    }

    init(path = 'monitor') {
        let url = this.node.url.replace('https://', 'wss://').replace('http://', 'ws://');

        this.socket = io(`${url}/${path}`, {
            upgrade: false,
            transports: ['websocket'],
            query: {
                wallet: this.wallet,
                signedData: null,
                'api-key': this.apiKey,
            },
        });

        return this.socket;
    }

    getSocket = (path = 'monitor') => {
        if (!this.socket) {
            return this.init(path);
        }
        return this.socket;
    };
}
