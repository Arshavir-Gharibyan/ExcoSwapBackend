import {getUserByJwt, getUserWalletPrivKey} from "../../../services/userService";
import {getExchangePrice, getSwapTokens, getUSDRate, imageExists} from "../../../services/swapService";
import {utils} from "ethers";
const fetch = require('isomorphic-fetch')
const {  BigNumber, Wallet } = require('ethers')
const providers = require('ethers').providers;
const { formatUnits, parseUnits } = require('ethers/lib/utils')
const  {OneInch}  = require('../../../services/OneInchService');
const rpcUrls = {
    ETH: 'https://mainnet.infura.io/v3/c18b3b234e6d44509b167035389b0cd1',
    BSC: 'https://bsc-dataseed.binance.org/',
}

const slugToChainId = {
    ETH: 1,
    BSC: 56
}
const abi = require('erc-20-abi')
const qs = require('qs');
var Tx = require('ethereumjs-tx').Transaction;
const erc20ABI = require('../../../ERC20TokenStandart.json')
const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
const web3 = createAlchemyWeb3('https://eth-mainnet.alchemyapi.io/v2/loE1nrEr5hubUXOWJrSeZONdzpdvB8et',{writeProvider:''});
const swapForTokens = async (req,res)=>{
    if (req.headers && req.headers.authorization) {
        const user = await getUserByJwt(req);
        if(user){
            const fromTokenAddress = req.fields.sellTokenAddress;
            const toTokenAddress = req.fields.buyTokenAddress;
            const formattedAmount = req.fields.sellAmount.toString()
            const chain = req.fields.walletType
            const chainId = slugToChainId[chain]
            const amount = parseUnits(formattedAmount, req.fields.sellTokenDecimals).toString()
            const oneInch = new OneInch()
            const result =  await oneInch.getQuote({ chainId, fromTokenAddress, toTokenAddress, amount })
            const resultUSDSellToken = await getUSDRate(req.fields.sellTokenSymbol);
            const resultUSD = await getUSDRate('ETH');
            const fee = (result.estimatedGas)*Math.pow(10,-9)
            const toTokenAmountFormatted = formatUnits(result.toTokenAmount, req.fields.buyTokenDecimals)
            if (result){
                res.status('200').send({
                    buyAmount:toTokenAmountFormatted,
                    sellAmountInUsd:(resultUSDSellToken.USD*req.fields.sellAmount).toFixed(2),
                    feeInSellAmountUsd:fee*resultUSD.USD,
                    feeInSellAmountETH:fee
                }) ;
            }else{
                res.status('404').send({
                    result:result.validationErrors
                }) ;
            }

        }
        else{

            res.status('401').send({
                error: "unauthorized"
            }) ;
        }
    }
    else{
        res.status('401').send({
            error: "unauthorized"
        });
    }
}
const getSwapTokensList= async(req,res)=>{
    if (req.headers && req.headers.authorization) {
        const user = await getUserByJwt(req);
        if(user){
            const result = await getSwapTokens()
            res.status('200').send({
                result: result.tokens
            }) ;
        }
        else{
            res.status('401').send({
                error: "unauthorized"
            }) ;
        }
    }
    else{
        res.status('401').send({
            error: "unauthorized"
        });
    }
}
const swapTokensSell = async (req,res)=>{
    if (req.headers && req.headers.authorization) {
        const user = await getUserByJwt(req);
        const sellTokenSymbol = req.fields.sellTokenSymbol
        const buyTokenSymbol = req.fields.buyTokenSymbol
        const sellAmount = req.fields.sellAmount*Math.pow(10,req.fields.sellTokenDecimals);
        const takerAddress =  req.fields.walletAddress
        const walletType = req.fields.walletType
        if(user){
            const params5 = {
                sellToken: sellTokenSymbol,
                buyToken: buyTokenSymbol,
                sellAmount: sellAmount, // 1 ETH = 10^18 wei
                takerAddress: takerAddress
            }

// Fetch the swap quote.
            const response = await fetch(
                `https://api.0x.org/swap/v1/quote?${qs.stringify(params5)}`
            );
           const privateKey = await getUserWalletPrivKey(user.id,walletType)
            try {
                const signedTx = await web3.eth.accounts.signTransaction(await response.json(), privateKey.private_key);
                web3.eth.sendSignedTransaction(signedTx.rawTransaction, function(error, hash) {
                    if (!error) {
                        res.status('200').send({
                            success: true,
                            error:''
                        }) ;
                    } else {
                        console.log("❗Something went wrong while submitting your transaction:", error)
                        res.status('400').send({
                            error: 'Error: Returned error: insufficient funds for gas * price + value'
                        }) ;
                    }
                });
            }
            catch (e){
                console.log(e)
                res.status('400').send({

                    error: "Bad Request"
                }) ;
            }
        }
        else{
            res.status('401').send({
                error: "unauthorized"
            }) ;
        }
    }
    else{
        res.status('401').send({
            error: "unauthorized"
        });
    }
}
const swapTokensOneInch = async (req,res)=>{
    if (req.headers && req.headers.authorization) {
        const user = await getUserByJwt(req);
        const sellTokenSymbol = req.fields.sellTokenSymbol
        const buyTokenSymbol = req.fields.buyTokenSymbol
        const sellAmount = req.fields.sellAmount*Math.pow(10,req.fields.sellTokenDecimals);
        const takerAddress =  req.fields.walletAddress
        const walletType = req.fields.walletType
        if(user){
            const errors = [];
            const chain = walletType
            const rpcUrl = rpcUrls[chain]
            const provider = new providers.StaticJsonRpcProvider(rpcUrl)
            const priv = await getUserWalletPrivKey(user.id,walletType)
            const wallet = new Wallet(priv.dataValues.private_key, provider)
            const oneInch = new OneInch()
            const chainId = slugToChainId[chain]
            const fromToken = sellTokenSymbol
            const toToken = buyTokenSymbol
            const slippage = 1
            const walletAddress = await wallet.getAddress()
            const formattedAmount = req.fields.sellAmount.toString()
            const amount = parseUnits(formattedAmount, req.fields.sellTokenDecimals).toString()
            console.log('chain:', chain)
            console.log('fromToken:', fromToken)
            console.log('toToken:', toToken)
            console.log('amount:', formattedAmount)

            const fromTokenAddress =  req.fields.sellTokenAddress
            const toTokenAddress = req.fields.buyTokenAddress
            const quote = await oneInch.getQuote({ chainId, fromTokenAddress, toTokenAddress, amount })
            const toTokenAmount =quote.toTokenAmount
            const toTokenAmountFormatted = formatUnits(toTokenAmount, req.fields.buyTokenDecimals)
            console.log(`toTokenAmount: ${toTokenAmountFormatted}`)
            const tokenAddress = fromTokenAddress
            const allowance = await oneInch.getAllowance({ chainId, tokenAddress, walletAddress })
            console.log('allowance:', allowance)
            if (BigNumber.from(allowance).lt(amount)) {
                try{
                    const txData = await oneInch.getApproveTx({ chainId, tokenAddress, amount })
                    console.log('approval data:', txData)
                    const tx = await wallet.sendTransaction(txData)
                    console.log('approval tx:', tx.hash)
                    await tx.wait()
                }catch(err){
                    errors.push(err)
                }

            }
            try {
                const fromAddress = walletAddress
                const txData = await oneInch.getSwapTx({ chainId, fromTokenAddress, toTokenAddress, fromAddress, amount, slippage })
                console.log('swap data:', txData)
                const tx = await wallet.sendTransaction(txData)
                console.log('swap tx:', tx.hash)
                await tx.wait()
            }catch (err){
                errors.push(err)
            }
            if (errors.length===0){
                res.status('200').send({
                    success: true,
                    error:''
                }) ;
            }else{
                res.status('400').send({
                    success: false,
                    error:errors
                }) ;
            }
        }
        else{
            res.status('401').send({
                error: "unauthorized"
            }) ;
        }
    }
    else{
        res.status('401').send({
            error: "unauthorized"
        });
    }
}
export {swapForTokens,getSwapTokensList,swapTokensSell,swapTokensOneInch}
