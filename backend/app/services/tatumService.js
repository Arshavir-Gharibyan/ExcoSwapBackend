import * as Bip39 from "bip39";

const BIP84 = require('bip84')
import Hdkey from "ethereumjs-wallet/dist.browser/hdkey";
import * as EthUtil from "ethereumjs-util";
import * as bip39 from "bip39";
import * as ed25519 from "ed25519-hd-key";

const solanaWeb3 = require('@solana/web3.js');

const axios = require("axios");
const getWalletXpubBTC = async (seedPhrase) => {
    try {
        return await axios.get(process.env.TATUM_API_URL + '/v3/bitcoin/wallet?mnemonic=' + seedPhrase,
            {
                headers: {
                    'x-api-key': process.env.TATUM_API_KEY,
                }
            });
    } catch (error) {
        return (error)
    }
}
const getWalletAddressBtc = async (xpub) => {
    try {
        return await axios.get(process.env.TATUM_API_URL + '/v3/bitcoin/address/' + xpub + '/0',
            {
                headers: {
                    'x-api-key': process.env.TATUM_API_KEY,
                }
            });
    } catch (error) {
        return (error)
    }
}
const getWalletXpubBSC = async (seedPhrase) => {
    try {
        return await axios.get(process.env.TATUM_API_URL + '/v3/bsc/wallet?mnemonic=' + seedPhrase,
            {
                headers: {
                    'x-api-key': process.env.TATUM_API_KEY
                }
            });
    } catch (error) {
        return (error)
    }
}
const getWalletAddressBsc = async (xpub) => {
    try {
        return await axios.get(process.env.TATUM_API_URL + '/v3/bsc/address/' + xpub + '/0',
            {
                headers: {
                    'x-api-key': process.env.TATUM_API_KEY,
                }
            });
    } catch (error) {
        return (error)
    }
}
const getWalletXpubCELO = async (seedPhrase) => {
    try {
        return await axios.get(process.env.TATUM_API_URL + '/v3/celo/wallet?mnemonic=' + seedPhrase,
            {
                headers: {
                    'x-api-key': process.env.TATUM_API_KEY,
                }
            });
    } catch (error) {
        return (error)
    }
}
const getWalletAddressCelo = async (xpub) => {
    try {
        return await axios.get(process.env.TATUM_API_URL + '/v3/celo/address/' + xpub + '/0',
            {
                headers: {
                    'x-api-key': process.env.TATUM_API_KEY,
                }
            });
    } catch (error) {
        return (error)
    }
}
const getWalletXpubETH = async (seedPhrase) => {
    try {
        return await axios.get(process.env.TATUM_API_URL + '/v3/ethereum/wallet?mnemonic=' + seedPhrase,
            {
                headers: {
                    'x-api-key': process.env.TATUM_API_KEY,
                    'x-testnet-type': 'ethereum-mainnet'
                }
            });
    } catch (error) {
        return (error)
    }
}
const getWalletAddressEth = async (xpub) => {
    try {
        return await axios.get(process.env.TATUM_API_URL + '/v3/ethereum/address/' + xpub + '/0',
            {
                headers: {
                    'x-api-key': process.env.TATUM_API_KEY,
                    'x-testnet-type': 'ethereum-mainnet'
                }
            });
    } catch (error) {
        return (error)
    }
}
const getWalletXpubMATIC = async (seedPhrase) => {
    try {
        return await axios.get(process.env.TATUM_API_URL + '/v3/polygon/wallet?mnemonic=' + seedPhrase,
            {
                headers: {
                    'x-api-key': process.env.TATUM_API_KEY,
                }
            });
    } catch (error) {
        return (error)
    }
}
const getWalletAddressMatic = async (xpub) => {
    try {
        return await axios.get(process.env.TATUM_API_URL + '/v3/polygon/address/' + xpub + '/0',
            {
                headers: {
                    'x-api-key': process.env.TATUM_API_KEY,
                }
            });
    } catch (error) {
        return (error)
    }
}
const getWalletAddressFantom = async (seedPhrase) => {
    const mnemonic = seedPhrase;
    const accountAddress = await mnemonicToKeys(mnemonic);
    return accountAddress.publicAddress;
}
const mnemonicToKeys = async (mnemonic) => {
    const seed = await Bip39.mnemonicToSeed(mnemonic);
    const root = Hdkey.fromMasterSeed(seed);
    const addrNode = root.derivePath("m'/44'/0'/0'");
    const pubKey = EthUtil.privateToPublic(addrNode._hdkey._privateKey);
    const addr = EthUtil.publicToAddress(pubKey).toString('hex');
    const publicAddress = EthUtil.toChecksumAddress(addr);
    return {publicAddress};

}
const getWalletAddressBTC = async (seedPhrase) => {
    const mnemonic = seedPhrase;
    const accountAddress = await mnemonicToKeysBTC(mnemonic);
    return accountAddress
}
const mnemonicToKeysBTC = async (mnemonic) => {
    const root = new BIP84.fromMnemonic(mnemonic)
    const child0 = root.deriveAccount(0)
    const account0 = new BIP84.fromZPrv(child0)
    return account0.getAddress(0)
}
const getWalletAddressSOLANA = async (seedPhrase) => {
    const mnemonic = seedPhrase;
    const account = generateAccount(mnemonic);
    return account.publicKey.toString();
}

function generateAccount(mnemonic) {
    const seed = bip39.mnemonicToSeedSync(mnemonic); // prefer async mnemonicToSeed
    const derivePath = "m/44'/501'/0'/0'";
    const derivedSeed = ed25519.derivePath(derivePath, seed.toString('hex')).key;
    const keyPair = solanaWeb3.Keypair.fromSeed(derivedSeed)
    return new solanaWeb3.Account(keyPair.secretKey);
}

const getAddressBalance = async (address, type) => {
    if (type === 'ethereum') {
        try {
            return await axios.get(process.env.TATUM_API_URL + `/v3/${type}/account/balance/${address}`,
                {
                    headers: {
                        'x-api-key': process.env.TATUM_API_KEY,
                        'x-testnet-type': 'ethereum-mainnet'
                    }
                });
        } catch (error) {
            return (error)
        }
    } else {
        try {
            return await axios.get(process.env.TATUM_API_URL + `/v3/${type}/account/balance/${address}`,
                {
                    headers: {
                        'x-api-key': process.env.TATUM_API_KEY
                    }
                });
        } catch (error) {
            return (error)
        }
    }
}
const getWalletPrivKey = async (seedPharse, type) => {
    switch (type) {
        case 'bsc':
            try {
                return await axios.post(process.env.TATUM_API_URL + `/v3/bsc/wallet/priv`,
                    {
                        "index": 0,
                        "mnemonic": seedPharse
                    },
                    {
                        headers: {
                            'x-api-key': process.env.TATUM_API_KEY,
                        }
                    }
                );
            } catch (error) {
                return (error)
            }
            break;
        case 'btc':
            const root = new BIP84.fromMnemonic(seedPharse)
            const child0 = root.deriveAccount(0)
            const account0 = new BIP84.fromZPrv(child0)
            return account0.getAccountPrivateKey(0)
            break;
        case 'ethereum':
            try {
                return await axios.post(process.env.TATUM_API_URL + `/v3/ethereum/wallet/priv`,
                    {
                        "index": 0,
                        "mnemonic": seedPharse
                    },
                    {
                        headers: {
                            'x-api-key': process.env.TATUM_API_KEY,
                            'x-testnet-type': 'ethereum-mainnet'
                        }
                    }
                );
            } catch (error) {
                return (error)
            }
            break;
        case 'matic':
            try {
                return await axios.post(process.env.TATUM_API_URL + `/v3/polygon/wallet/priv`,
                    {
                        "index": 0,
                        "mnemonic": seedPharse
                    },
                    {
                        headers: {
                            'x-api-key': process.env.TATUM_API_KEY
                        }
                    }
                );
            } catch (error) {
                return (error)
            }
            break;
        case 'celo':
            try {
                return await axios.post(process.env.TATUM_API_URL + `/v3/celo/wallet/priv`,
                    {
                        "index": 0,
                        "mnemonic": seedPharse
                    },
                    {
                        headers: {
                            'x-api-key': process.env.TATUM_API_KEY
                        }
                    }
                );
            } catch (error) {
                return (error)
            }
            break;
        case 'solana':
            const account = generateAccount(seedPharse);
            const base64String = btoa(String.fromCharCode.apply(null, new Uint8Array(account. secretKey)));
            return base64String
            break;
        case 'fantom':
            const seed = await Bip39.mnemonicToSeed(seedPharse);
            const roots = Hdkey.fromMasterSeed(seed);
            const addrNode = roots.derivePath("m'/44'/0'/0'");
            const privKey = addrNode._hdkey._privateKey;
            const base64Stringf = btoa(String.fromCharCode.apply(null, new Uint8Array(privKey)));
            return base64Stringf
            break;
    }
}
export {
    getWalletXpubBTC,
    getWalletPrivKey,
    getWalletAddressBtc,
    getWalletXpubBSC,
    getWalletAddressBsc,
    getWalletXpubCELO,
    getWalletAddressCelo,
    getWalletXpubETH,
    getWalletAddressEth,
    getWalletXpubMATIC,
    getWalletAddressMatic,
    getWalletAddressFantom,
    getWalletAddressSOLANA,
    getWalletAddressBTC,
    getAddressBalance
}
