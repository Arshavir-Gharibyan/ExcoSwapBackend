import bs58 from "bs58";
import {
    Connection,
    Transaction,
    PublicKey
} from "@solana/web3.js";
import got from "got";

import promiseRetry from "promise-retry";

import {providers, Wallet} from "ethers";
import {getUserWalletPrivKey} from "./userService";
import user from "../routes/api/v1/user";
//const walletType = req.fields.walletType
const provider = new providers.StaticJsonRpcProvider('https://ssc-dao.genesysgo.net')
//const priv = await getUserWalletPrivKey(user.id,walletType)
//const wallet = new Wallet(priv.dataValues.private_key, provider)
const connection = new Connection("https://solana-api.projectserum.com")
const baseUrl = 'https://quote-api.jup.ag/v1'

const getCoinQuote = (inputMint, outputMint, amount) =>
    got
        .get(`${baseUrl}/quote?outputMint=${outputMint}&inputMint=${inputMint}&amount=${amount}&slippage=0.2`)
        .json()

const getTransaction = (route) => {
    return got
        .post(`${baseUrl}/swap`, {
            json: {
                route: route,
                userPublicKey: wallet.publicKey.toString(),
                wrapUnwrapSOL: false,
            },
        })
        .json()
}
const getConfirmTransaction = async (txid) => {
    const res = await promiseRetry(
        async (retry, attempt) => {
            let txResult = await connection.getTransaction(txid, {
                commitment: "confirmed",
            });

            if (!txResult) {
                const error = new Error("Transaction was not confirmed");
                error.txid = txid;

                retry(error);
                return;
            }
            return txResult;
        },
        {
            retries: 40,
            minTimeout: 500,
            maxTimeout: 1000,
        }
    )
    if (res.meta.err) {
        throw new Error("Transaction failed");
    }
    return txid
}

if (solToUsdc.data[0].outAmount > initial) {
    await Promise.all(
        [usdcToSol.data[0], solToUsdc.data[0]].map(async (route) => {
            const { setupTransaction, swapTransaction, cleanupTransaction } =
                await getTransaction(route)

            await Promise.all(
                [setupTransaction, swapTransaction, cleanupTransaction]
                    .filter(Boolean)
                    .map(async (serializedTransaction) => {

                        const transaction = Transaction.from(
                            Buffer.from(serializedTransaction, "base64")
                        )
                        const txid = await connection.sendTransaction(
                            transaction,
                            [wallet.payer],
                            {
                                skipPreflight: true,
                            }
                        )
                        try {
                            await getConfirmTransaction(txid);
                            console.log(`Success: https://solscan.io/tx/${txid}`);
                        } catch (e) {
                            console.log(`Failed: https://solscan.io/tx/${txid}`);
                        }
                    })
            )
        })
    )
}
