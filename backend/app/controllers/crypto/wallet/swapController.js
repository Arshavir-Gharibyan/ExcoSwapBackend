import {getUserByJwt, getUserWalletPrivKey} from "../../../services/userService";
import {getExchangePrice, getSwapTokens, getUSDRate, imageExists} from "../../../services/swapService";
const fetch = require('isomorphic-fetch')
const {  BigNumber, Wallet } = require('ethers')
const providers = require('ethers').providers;
const { formatUnits, parseUnits } = require('ethers/lib/utils')
const priv = '0x02ec414c754f9405a3eaaeaf09517df77db43dc293b84645ad9e0b36296195b4'
const  {OneInch}  = require('../../../services/OneInchService');
const rpcUrls = {
    ETH: 'https://mainnet.infura.io/v3/c18b3b234e6d44509b167035389b0cd1',
    BSC: 'https://bsc-dataseed1.ninicoin.io/',
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
            const resultUSD = await getUSDRate();
            const fee = (result.estimatedGas)*Math.pow(10,-18)
            const toTokenAmountFormatted = formatUnits(result.toTokenAmount, req.fields.buyTokenDecimals)
            if (result){
                res.status('200').send({
                    buyAmount:toTokenAmountFormatted,
                    // sellAmountInUsd:(resultUSD.USD*req.fields.sellAmount).toFixed(2),
                    // feeInSellAmountUsd:fee*resultUSD.USD,
                    // feeInSellAmountETH:fee
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
            const chainSymbol= req.params.chainSymbol
            const chainId =slugToChainId[chainSymbol]
            const result = await getSwapTokens(chainId)
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
            const wallet = new Wallet(priv, provider)
            console.log(wallet,1596)
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
            const gasLimit = quote.estimatedGas
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

            // const txData = {
            //     data: '0x2e95b6c80000000000000000000000006b175474e89094c44da98b954eedeac495271d0f0000000000000000000000000000000000000000000000000de0b6b3a764000000000000000000000000000000000000000000000000000000000000000f0b580000000000000000000000000000000000000000000000000000000000000080000000000000000000000000000000000000000000000000000000000000000100000000000000003b6d0340b20bd5d04be54f870d5c0d3ca85d82b34b836405cfee7c08',
            //     to: '0x1111111254fb6c44bac0bed2854e76f90643097d',
            //     value: '0',
            //     gasLimit:gasLimit
            // }
            // try {
            //     const tx = await wallet.sendTransaction(txData)
            //     console.log('swap tx:', tx.hash)
            //     await tx.wait()
            // } catch (err) {
            //     errors.push(err.reason)
            // }
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
