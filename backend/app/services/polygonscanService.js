import axios from "axios";
const getAddressTransferEvents = async (address)=>{
    try {
        return  await axios.get(process.env.POLYGONSCAN_API_URL +`?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&page=1&offset=10sort=asc&apikey=${process.env.POLYGONSCAN_API_KEY}`,
        );
    } catch (error) {
        return(error)
    }
}
const getListContractAddresses = async (data)=>{
    const contractAddresses = [];

    data.result.forEach((curr) => {
        if (!contractAddresses.includes(curr.contractAddress)) {
            contractAddresses.push(curr.contractAddress);
        }
    });
    return contractAddresses
}
const getTokenBalanceFromContractAddress = async (contractaddresses, address) =>{
    let result = [];
    await Promise.all(contractaddresses.map(async (curr) => {
        const balance = await axios.get(process.env.POLYGONSCAN_API_URL + `?module=account&action=tokenbalance&contractaddress=${curr}&address=${address}&tag=latest&apikey=${process.env.POLYGONSCAN_API_KEY}`)
        result.push({
            'balance': balance.data.result,
            'coin_address': curr
        })
    }));
    return  result
}
const getTokenInfoFromContractAddress = async (balance)=>{
    let result = [];
    const getData = async (curr) => {
        const data = await axios.get(process.env.POLYGONSCAN_API_URL + `?module=token&action=tokeninfo&contractaddress=${curr.coin_address}&apikey=${process.env.POLYGONSCAN_API_KEY}`)
        if (Array.isArray(data.data.result)) {
            return data;
        } else {
            return await getData(curr);
        }
    }
    await Promise.all(balance.map(async (curr) => {
        const info = await getData(curr);
        if(info.data.result[0].symbol){
            const currentRes ={
                'img':`https://etherscan.io/token/images/${info.data.result[0].symbol.toLowerCase()}_28.png`,
                'coin':info.data.result[0].symbol,
                'balance':(curr.balance/Math.pow(10,info.data.result[0].divisor)).toString().includes('e-')? 0:curr.balance/Math.pow(10,info.data.result[0].divisor),
                'coin_address': curr.coin_address
            }
            result.push({...currentRes})
        }
    }));

    return result
}
export {getAddressTransferEvents,getListContractAddresses,getTokenBalanceFromContractAddress,getTokenInfoFromContractAddress}
