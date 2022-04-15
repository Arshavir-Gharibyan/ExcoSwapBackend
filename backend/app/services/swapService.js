import {XMLHttpRequest} from "xmlhttprequest";
import axios from "axios";

const qs = require('qs');
const getExchangePrice= async(sellToken,buyToken,sellAmount)=>{
    const params = {
        sellToken:sellToken,
        buyToken: buyToken,
        sellAmount: sellAmount,
    }
    const response = await fetch(
        `https://api.0x.org/swap/v1/quote?buyToken=${buyToken}&sellToken=${sellToken}&sellAmount=${sellAmount}&excludedSources=0x,Kyber`
    );
    return response.json();
}
const getSwapTokens= async()=>{
    const response1 = await fetch(
        `https://api.1inch.exchange/v4.0/1/tokens`
    )
    const response1json = await response1.json()
    const response56 = await fetch(
        `https://api.1inch.exchange/v4.0/56/tokens`
    )
    const response56json = await response56.json()
    const response137 = await fetch(
        `https://api.1inch.exchange/v4.0/137/tokens`
    )
    const response137json = await response137.json()
    const response = {...response1json.tokens, ...response56json.tokens,...response137json.tokens}

    return response;
}
const getUSDRate= async(symbol)=>{
    const response = await fetch(
        `https://min-api.cryptocompare.com/data/price?fsym=${symbol}&tsyms=BTC,USD,EUR`
    );
    return response.json();
}
export{getExchangePrice,getSwapTokens,getUSDRate}
