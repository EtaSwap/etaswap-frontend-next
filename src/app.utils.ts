export const saucerMapDefault = {
    mainnet: {
        getTokensUrl: 'https://api.saucerswap.finance/tokens',
        whbar: '0x0000000000000000000000000000000000163b5a',
        oracle: '0xc47037963fad3a5397cca3fef5c1c95839dc6363',
    },
    testnet: {
        getTokensUrl: 'https://test-api.saucerswap.finance/tokens',
        whbar: '0x000000000000000000000000000000000000e6a2',
        oracle: '0x4afa14cbA5043BE757c028b0D0B5148df12ce9e4',
    }
}

export const pangolinDefault = {
    mainnet: {
        getTokensUrl: 'https://raw.githubusercontent.com/pangolindex/tokenlists/main/pangolin.tokenlist.json',
        whbar: '0x00000000000000000000000000000000001a8837',
        oracle: '0xfa7206b4c9d46af2e2f7f3b1bd4d3aa2aeca6e71',
    },
    testnet: {
        getTokensUrl: 'https://raw.githubusercontent.com/pangolindex/tokenlists/main/pangolin.tokenlist.json',
        whbar: '0x000000000000000000000000000000000002690a',
        oracle: '0x9dAdB3285AC2d65A2cbB1341Aa0c14edc8c2F2b9',
    }
}

export const hsuitDefault = {
    mainnet: {
        getTokensUrl: 'https://mainnet-sn1.hbarsuite.network/tokens/list',
        whbar: null,
        oracle: null,
    },
    testnet: {
        getTokensUrl: 'https://testnet-sn1.hbarsuite.network/tokens/list',
        whbar: null,
        oracle: null,
    }
}

export const heliSwapDefault = {
    mainnet: {
        getTokensUrl: 'https://heliswap.infura-ipfs.io/ipfs/Qmf5u6N2ohZnBc1yxepYzS3RYagkMZbU5dwwU4TGxXt9Lf',
        whbar: '0x00000000000000000000000000000000002cc823',
        oracle: '0x51851a39da39c53f9b564cfdf7e6f55dc8850225',
    },
    testnet: {
        getTokensUrl: null,
        whbar: null,
        oracle: null,
    }
}
