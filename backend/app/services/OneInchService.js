const fetch = require('isomorphic-fetch')
const { providers, BigNumber, Wallet } = require('ethers')
const { formatUnits, parseUnits } = require('ethers/lib/utils')
class OneInch {
    constructor () {
        this.baseUrl = 'https://api.1inch.exchange/v4.0'
    }

    async getQuote (config) {
        const { chainId, fromTokenAddress, toTokenAddress, amount } = config
        if (!chainId) {
            console.log(chainId,1111)
            throw new Error('chainId is required')
        }
        if (!fromTokenAddress) {
            throw new Error('fromTokenAddress is required')
        }
        if (!toTokenAddress) {
            throw new Error('toTokenAddress is required')
        }
        if (!amount) {
            throw new Error('amount is required')
        }
        const url = `${this.baseUrl}/${chainId}/quote?fromTokenAddress=${fromTokenAddress}&toTokenAddress=${toTokenAddress}&amount=${amount}`
        const result = await this.getJson(url)
        if (!result.toTokenAmount) {
            console.log(result)
            throw new Error('expected tx data')
        }

        const { toTokenAmount } = result
        const {estimatedGas} = result
        return {'toTokenAmount':toTokenAmount,
             'estimatedGas': estimatedGas}
    }

    async getAllowance (config) {
        const { chainId, tokenAddress, walletAddress } = config
        if (!chainId) {
            throw new Error('chainId is required')
        }
        if (!tokenAddress) {
            throw new Error('tokenAddress required')
        }
        if (!walletAddress) {
            throw new Error('walletAddress is required')
        }

        const url = `${this.baseUrl}/${chainId}/approve/allowance?tokenAddress=${tokenAddress}&walletAddress=${walletAddress}`
        const result = await this.getJson(url)
        if (result.allowance === undefined) {
            console.log(result)
            throw new Error('expected tx data')
        }

        return result.allowance
    }

    async getApproveTx (config) {
        const { chainId, tokenAddress, amount } = config
        if (!chainId) {
            throw new Error('chainId is required')
        }
        if (!tokenAddress) {
            throw new Error('tokenAddress required')
        }
        if (!amount) {
            throw new Error('amount is required')
        }

        const url = `${this.baseUrl}/${chainId}/approve/transaction?&amount=${amount}&tokenAddress=${tokenAddress}`
        const result = await this.getJson(url)
        if (!result.data) {
            console.log(result)
            throw new Error('expected tx data')
        }

        const { data, to, value } = result

        return {
            data,
            to,
            value
        }
    }

    async getSwapTx (config) {
        const { chainId, fromTokenAddress, toTokenAddress, fromAddress, amount, slippage } = config
        if (!chainId) {
            throw new Error('chainId is required')
        }
        if (!fromTokenAddress) {
            throw new Error('fromTokenAddress is required')
        }
        if (!toTokenAddress) {
            throw new Error('toTokenAddress is required')
        }
        if (!fromAddress) {
            throw new Error('fromAddress is required')
        }
        if (!amount) {
            throw new Error('amount is required')
        }
        if (!slippage) {
            throw new Error('slippage is required')
        }
        const url = `${this.baseUrl}/${chainId}/swap?fromTokenAddress=${fromTokenAddress}&toTokenAddress=${toTokenAddress}&amount=${amount}&fromAddress=${fromAddress}&slippage=${slippage}`
        const result = await this.getJson(url)
        if (!result.tx) {
            console.log(result)
            throw new Error('expected tx data')
        }

        const { data, to, value } = result.tx

        return {
            data,
            to,
            value
        }
    }

    async getJson (url) {
        const res = await fetch(url)
        const json = await res.json()
        if (!json) {
            throw new Error('no response')
        }
        if (json.error) {
            console.log(json)
            throw new Error(json.description || json.error)
        }

        return json
    }
}
module.exports = {
    OneInch
};

