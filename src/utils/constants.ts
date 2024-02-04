import {IGASLIMITS} from "../models";

export const NETWORKS = {
    MAINNET: 'mainnet',
    TESTNET: 'testnet',
};

export const GAS_LIMITS: IGASLIMITS = {
    SaucerSwap: {
        exactTokenToToken: 900000, //877969    875079
        exactHBARToToken: 260000, //221207     203366
        exactTokenToHBAR: 1690000, //1629306   1623679     1040000
        tokenToExactToken: 920000, //894071    891182
        HBARToExactToken: 260000, //211040     218135      208000
        tokenToExactHBAR: 1690000, //1645353   1639941     1352000
    },
    Pangolin: {
        exactTokenToToken: 900000,
        exactHBARToToken: 260000,
        exactTokenToHBAR: 1690000,
        tokenToExactToken: 920000,
        HBARToExactToken: 260000,
        tokenToExactHBAR: 1690000,
    },
    HeliSwap: {
        exactTokenToToken: 900000,
        exactHBARToToken: 260000,
        exactTokenToHBAR: 1300000, // Experimental
        tokenToExactToken: 920000,
        HBARToExactToken: 250000,
        tokenToExactHBAR: 1150000, // Experimental
    },
};

export const HSUITE_NODES = {
    [NETWORKS.MAINNET]: [
        {
            'operator': '0.0.1786597',
            'publicKey': '302a300506032b65700321003f54816030c29221e4f228c76415cba0db1ab4c49827d9dbf580abc2f2b29c24',
            'url': 'https://mainnet-sn1.hbarsuite.network'
        },
        {
            'operator': '0.0.1786598',
            'publicKey': '302a300506032b6570032100233b043e21d5e148f48e2c2da6607a1f5e6fc381781bd0561967743a8291785e',
            'url': 'https://mainnet-sn2.hbarsuite.network'
        },
        {
            'operator': '0.0.1786599',
            'publicKey': '302a300506032b6570032100c236c88b0aadccf86cc09c57734401409e301d45018ab179f8463801f486c89a',
            'url': 'https://mainnet-sn3.hbarsuite.network'
        },
        {
            'operator': '0.0.1786344',
            'publicKey': '302a300506032b65700321004e3c29113c911ce6dba13669fda53ed1ab3d89547e23c0b7ab2275fd5dc05766',
            'url': 'https://mainnet-sn4.hbarsuite.network'
        },
        {
            'operator': '0.0.1786344',
            'publicKey': '302a300506032b65700321004e3c29113c911ce6dba13669fda53ed1ab3d89547e23c0b7ab2275fd5dc05766',
            'url': 'https://mainnet-sn5.hbarsuite.network'
        },
        {
            'operator': '0.0.1786345',
            'publicKey': '302a300506032b6570032100077bfba9f0fb180026f0de51d4e1083d616eff34a8fe62a1c0e34dd975b7f8cf',
            'url': 'https://mainnet-sn6.hbarsuite.network'
        },
        {
            'operator': '0.0.1786347',
            'publicKey': '302a300506032b6570032100ff792317f5a24278f1a2dddfc9a23670e158ccb9ecd42cdd0ab36e5ad8bc40a6',
            'url': 'https://mainnet-sn7.hbarsuite.network'
        },
        {
            'operator': '0.0.1786365',
            'publicKey': '302a300506032b6570032100485e23e18834571e466f96de9f96f228a1f5da860b319f0f0cb2890f938f298d',
            'url': 'https://mainnet-sn8.hbarsuite.network'
        }
    ],
    [NETWORKS.TESTNET]: [
        {
            'operator': '0.0.467726',
            'publicKey': '302a300506032b6570032100ae51a8b5d22e40d68fec62e20488132182f304cddbf5cd494d62cb18a06b71c1',
            'url': 'https://testnet-sn1.hbarsuite.network'
        },
        {
            'operator': '0.0.467732',
            'publicKey': '302a300506032b657003210014e45f62427a777c8a5c168115793969c5fa04979b6a40a34c3bff7d20a3b745',
            'url': 'https://testnet-sn2.hbarsuite.network'
        },
        {
            'operator': '0.0.467734',
            'publicKey': '302a300506032b65700321002caf57f6153afb61ed70545516886b1621aa93dd22ae79412f5af0cbfcd2b5ab',
            'url': 'https://testnet-sn3.hbarsuite.network'
        },
        {
            'operator': '0.0.467737',
            'publicKey': '302a300506032b6570032100452e3d988c2f0e40b6194c7543ec880daaefa29b6c48e590b367bbe22de429d3',
            'url': 'https://testnet-sn4.hbarsuite.network'
        }
    ]
}
