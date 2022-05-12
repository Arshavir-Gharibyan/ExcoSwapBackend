import {XMLHttpRequest} from "xmlhttprequest";
import axios from "axios";
import tokens from "../routes/api/v1/tokens";
import {poly} from "googleapis/build/src/apis/poly";

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
const getSwapTokens = async()=>{
    const response1 = await fetch(
        `https://api.1inch.exchange/v4.0/1/tokens`
    )
    const response1json = await response1.json()
    const ethResponse =  {'eth':response1json}

    const response56 = await fetch(
        `https://api.1inch.exchange/v4.0/56/tokens`
    )
    const response56json = await response56.json()
    const bscResponse = {'bsc':response56json}

    const response137 = await fetch(
        `https://api.1inch.exchange/v4.0/137/tokens`
    )
    const response137json = await response137.json()
    const polygonResponse = {'pol':response137json}
   // console.log(polygonResponse)
    const response250 = await fetch(
        `https://api.1inch.exchange/v4.0/250/tokens`
    )
    const response250json = await response250.json()
    const fantomResponse = {'ftm':response250json}
    //console.log(fantomResponse)

    const response = {...ethResponse,...bscResponse,...polygonResponse,...fantomResponse}
    return fantomResponse;
}
const getSwapTokensSolana = async()=>{

    const response = await fetch(
        `https://quote-api.jup.ag/v1/indexed-route-map?onlyDirectRoutes=true`
    )
    const routeMap = await response.json()
    const listAddresses = routeMap.mintKeys
    return routeMap;
}
const getUSDRate= async(symbol)=>{
    const response = await fetch(
        `https://min-api.cryptocompare.com/data/price?fsym=${symbol}&tsyms=BTC,USD,EUR`
    );
    return response.json();
}
export{getExchangePrice,getSwapTokens,getUSDRate,getSwapTokensSolana}
