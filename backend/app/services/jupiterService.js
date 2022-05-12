import {Connection, Keypair, Transaction} from '@solana/web3.js'
import fetch from 'cross-fetch'
import { Wallet } from '@project-serum/anchor'
import bs58 from 'bs58'

class Jupiter {
    constructor () {
        this.baseUrl = 'https://quote-api.jup.ag/v1'
    }

    async setUpConnection(rpc){
       const connection  = new Connection(rpc)
        return connection
    }
    async setUpWallet(priv){
            const wallet = new Wallet(Keypair.fromSecretKey(new Uint8Array(new Buffer.from(priv,'base64'))))
        return wallet
    }

    async getQuote(config) {
        const { inputMint, outputMint, amount } = config
        if (!inputMint) {
            throw new Error('inputMint is required')
        }
        if (!outputMint) {
            throw new Error('outputMint is required')
        }
        if (!amount) {
            throw new Error('amount is required')
        }
        const { data } = await (
            await fetch(
                `${this.baseUrl}/quote?inputMint=${inputMint}&outputMint=${outputMint}&amount=${amount}&slippage=0.5&feeBps=4`
            )
        ).json()
        const routes = data
        return routes
    }

    async getSwap(config,routes,walletSolana){

        const { outputMint, inputMint, amount} = config
        if (!outputMint) {
            throw new Error('fromTokenAddress is required')
        }
        if (!inputMint) {
            throw new Error('toTokenAddress is required')
        }
        if (!amount) {
            throw new Error('amount is required')
        }

        const transactions = await (
            await fetch(`${this.baseUrl}/swap`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    route: routes[0],
                    userPublicKey: walletSolana.publicKey.toString(),
                    wrapUnwrapSOL: true
                })
            })
        ).json()
        const confirm = {commitment: 'confirmed', confirmTransactionInitialTimeout: 80000}
        const connection = new Connection("https://ssc-dao.genesysgo.net", confirm)
        const { setupTransaction, swapTransaction, cleanupTransaction } = transactions
            for (let serializedTransaction of [setupTransaction, swapTransaction, cleanupTransaction].filter(Boolean)) {
                const transaction = Transaction.from(Buffer.from(serializedTransaction, 'base64'))
                const txid = await connection.sendTransaction(transaction, [walletSolana.payer], {
                    skipPreflight: true
                })
                return txid
            }
    }

}

module.exports ={
     Jupiter
}
