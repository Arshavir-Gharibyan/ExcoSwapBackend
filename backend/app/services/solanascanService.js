import axios from "axios"
const getAddressTransferEvents = async(address)=>{
    try {
        return  await axios.get(`https://public-api.solscan.io/account/splTransfers?account=${address}&offset=0&limit=10`)
    }
    catch (error){
        return (error)
    }
}
const getListAddresses = async (data)=>{
    const addresses = []

    data.result.forEach((curr) => {
        if (!addresses.includes(curr.address)) {
            addresses.push(curr.address);
        }
    })
    return addresses
}
const getTokenBalanceFromAddress = async (addresses, address) =>{
    let result = [];
    await Promise.all(addresses.map(async (curr) => {
        const balance = await axios.get(`https://public-api.solscan.io/account/splTransfers?account=${address}&offset=0&limit=10`)
        result.push({
            'balance': balance.data.balance.amount,
            'coin_address': curr
        })
    }))
    return  result
}

const getTokenInfoFromAddress = async (balance)=>{
    let result = []
    const getData = async (curr) => {
        const data = await axios.get(`https://public-api.solscan.io/token/meta?tokenAddress=${curr}`)
        if (Array.isArray(data.data.balance.amount)) {
            return data
        } else {
            return await getData(curr)
        }
    }
    await Promise.all(balance.map(async (curr) => {
        const info = await getData(curr)
        if(info.data.balance.amount[0].symbol){
            const currentRes ={
                'img': info.icon,
                'coin':info.data.balance.amount[0].symbol,
                'balance':(curr.balance/Math.pow(10,info.data.balance.amount[0].decimal)).toString().includes('e-')? 0:curr.balance/Math.pow(10,info.data.balance.amount[0].decimal),
                'coin_address': curr.coin_address
            }
            result.push({...currentRes})
        }
    }))

    return result
}
export {getAddressTransferEvents,getListAddresses,getTokenBalanceFromAddress,getTokenInfoFromAddress}

