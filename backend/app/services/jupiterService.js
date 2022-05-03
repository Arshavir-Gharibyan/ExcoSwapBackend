import { Connection, Keypair, Transaction } from '@solana/web3.js'
import fetch from 'cross-fetch'
//import { Wallet } from '@project-serum/anchor'
import bs58 from 'bs58'
import { TokenListProvider} from '@solana/spl-token-registry';
import {Wallet} from "ethers";

class Jupiter {
    constructor () {
        this.baseUrl = 'https://quote-api.jup.ag/v1'
    }


    async getQuote(config) { //5. Get the routes for a swap
        const { fromTokenAddress, toTokenAddress, amount } = config

        if (!fromTokenAddress) {
            throw new Error('fromTokenAddress is required')
        }
        if (!toTokenAddress) {
            throw new Error('toTokenAddress is required')
        }
        if (!amount) {
            throw new Error('amount is required')
        }
        const {data} = await (
            await fetch(
                `${this.baseUrl}/quote?inputMint=${fromTokenAddress}&outputMint=${toTokenAddress}&amount=${amount}&slippage=0.5&feeBps=4`)).json()
        const routes = data
        console.log(routes)
        return routes
    }

     async getSwap(config){

    //     const { fromTokenAddress, toTokenAddress, fromAddress, amount } = config
    //
    //     if (!fromTokenAddress) {
    //         throw new Error('fromTokenAddress is required')
    //     }
    //     if (!toTokenAddress) {
    //         throw new Error('toTokenAddress is required')
    //     }
    //     if (!fromAddress) {
    //         throw new Error('fromAddress is required')
    //     }
    //     if (!amount) {
    //         throw new Error('amount is required')
    //     }
    //     // if (!slippage) {
    //     //     throw new Error('slippage is required')
    //     // }
    //     const connection = new Connection('https://ssc-dao.genesysgo.net')
    //     const transactions = await (
    //         await fetch(`${this.baseUrl}/swap`, {
    //             method: 'POST',
    //             headers: {
    //                 'Content-Type': 'application/json'
    //             },
    //             body: JSON.stringify({
    //
    //                 route: routes[0],
    //
    //                 userPublicKey: wallet.publicKey.toString(),
    //
    //                 wrapUnwrapSOL: true,
    //
    //                 feeAccount: "xxxx"
    //             })
    //         })
    //     ).json()
    //
    //     const { setupTransaction, swapTransaction, cleanupTransaction } = transactions
    //     // Execute the transactions
    //     for (let serializedTransaction of [setupTransaction, swapTransaction, cleanupTransaction].filter(Boolean)) {
    //         // get transaction object from serialized transaction
    //         const transaction = Transaction.from(Buffer.from(serializedTransaction, 'base64'))
    //         // perform the swap
    //         const txid = await connection.sendTransaction(transaction, [wallet.payer], {
    //             skipPreflight: true
    //         })
    //         await connection.confirmTransaction(txid)
    //         console.log(`https://solscan.io/tx/${txid}`)
    //     }
    //
         if (fromTokenAddress.data[0].outAmount > initial) {
             await Promise.all(
                 [toTokenAddress.data[0], fromTokenAddress.data[0]].map(async (route) => {
                     const { setupTransaction, swapTransaction, cleanupTransaction } =
                         await getTransaction(route);

                     await Promise.all(
                         [setupTransaction, swapTransaction, cleanupTransaction]
                             .filter(Boolean)
                             .map(async (serializedTransaction) => {
                                 // get transaction object from serialized transaction
                                 const transaction = Transaction.from(
                                     Buffer.from(serializedTransaction, "base64")
                                 );
                                 // perform the swap
                                 // Transaction might failed or dropped
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
                     );
                 })
             );
         }
     }


}

module.exports ={
     Jupiter
}
