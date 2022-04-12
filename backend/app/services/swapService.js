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
    const response = await fetch(
        `https://api.1inch.exchange/v4.0/1/tokens`
    );
    return response.json();
}
const getUSDRate= async()=>{
    const response = await fetch(
        `https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=BTC,USD,EUR`
    );
    return response.json();
}
export{getExchangePrice,getSwapTokens,getUSDRate}
