import {getUserByJwt, getUserWalletPrivKey} from "../../../services/userService";
import {getExchangePrice, getSwapTokens, getUSDRate, imageExists} from "../../../services/swapService";
import { BigNumber } from '@0x/utils';
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
            const sellAddress = req.fields.sellTokenSymbol;
            const buyAddress = req.fields.buyTokenSymbol;
            const sellAmount = req.fields.sellAmount*Math.pow(10,req.fields.sellTokenDecimals);
            const result = await getExchangePrice(sellAddress,buyAddress,sellAmount)
            const resultUSD = await getUSDRate();
            const fee = (result.estimatedGas*result.gasPrice)*Math.pow(10,-18)

            if (result.buyAmount){
                res.status('200').send({
                    buyAmount:result.price*req.fields.sellAmount,
                    sellAmountInUsd:(resultUSD.USD*req.fields.sellAmount).toFixed(2),
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
            const obj = result.records.map((item) => {
                return {
                    "symbol": item.symbol,
                    "address": item.address,
                    "logo": `https://tokens.1inch.io/${item.address}.png`,
                    "decimals":item.decimals
                }
            });
            res.status('200').send({
                result: obj
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
export {swapForTokens,getSwapTokensList,swapTokensSell}
