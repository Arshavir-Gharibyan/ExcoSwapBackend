import axios from "axios";
const getAddressTransferEvents = async (address)=>{
    try {
        return  await axios.get(process.env.FTMSCAN_API_URL +`?module=account&action=tokentx&address=0xB08dCb8Ce5c3D597C320D8d50089bAC7F9241E16&startblock=0&endblock=999999999&sort=asc&apikey=${process.env.FTMSCAN_API_KEY}`,
        );
    } catch (error) {
        return(error)
    }
}
const getTokenBalanceFromContractAddress = async (contractaddresses, address) =>{
    let result = [];
    await Promise.all(contractaddresses.map(async (curr) => {
        const balance = await axios.get(process.env.FTMSCAN_API_URL + `?module=account&action=tokenbalance&contractaddress=${curr}&address=0xB08dCb8Ce5c3D597C320D8d50089bAC7F9241E16&tag=latest&apikey=${process.env.FTMSCAN_API_KEY}`)
        result.push({
            'balance': balance.data.result,
            'coin_address': curr
        })
    }));
    return  result
}
const getTokenInfoFromContractAddress = async (balance)=>{
    let result = {};
    console.log(balance,1234)
    // await Promise.all(balance.map(async (curr) => {
    //     const info = await axios.get(process.env.ETHERSCAN_API_URL + `?module=token&action=tokeninfo&contractaddress=${curr.coin_address}&apikey=${process.env.ETHERSCAN_API_KEY}`)
    //    console.log(info)
    //     if(info.data.result[0].symbol){
    //         const currentRes ={
    //             'img':`https://ftmscan.com//token/images/${info.data.result[0].symbol.toLowerCase()}_32.png`,
    //             'coin':info.data.result[0].symbol,
    //             'balance':(curr.balance/Math.pow(10,info.data.result[0].divisor)).toString().includes('e-')? 0:curr.balance/Math.pow(10,info.data.result[0].divisor),
    //             'coin_address': curr.coin_address
    //         }
    //         result={...currentRes}
    //     }
    // }));
    return  result
}
export {getAddressTransferEvents,getTokenBalanceFromContractAddress,getTokenInfoFromContractAddress}
