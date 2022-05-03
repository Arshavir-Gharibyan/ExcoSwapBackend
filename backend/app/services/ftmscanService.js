import axios from "axios";

const getAddressTransferEvents = async (address) => {
    try {
        return await axios.get(process.env.FTMSCAN_API_URL + `?module=account&action=tokentx&address=${address}&startblock=0&endblock=999999999&sort=asc&apikey=${process.env.FTMSCAN_API_KEY}`,
        )
    } catch (error) {
        return (error)
    }
}
const getListContractAddresses = async (data) => {
    const cAddresses = []
    data.result.forEach((curr) => {
        const contractAddresses = {
            address: curr.contractAddress,
            tokenName: curr.tokenName,
            tokenSymbol: curr.tokenSymbol,
            tokenDivisor: curr.tokenDecimal
        };
        cAddresses.every(item => item.address !== curr.contractAddress) && cAddresses.push(contractAddresses)
    })
    return cAddresses
}

const getTokenBalanceFromContractAddress = async (contractaddresses, address) => {
    const result = []
    const getData = async (item, i) => {
if (item){
    try {
        const res = await axios.get(process.env.FTMSCAN_API_URL + `?module=account&action=tokenbalance&contractaddress=${item.address}&address=${address}&tag=latest&apikey=${process.env.FTMSCAN_API_KEY}`)
        const data = res.data
        if (data.result !== '0') {
            result.push({
                'balance': data.result,
                'coin_address': item.address,
                'coin_name':item.tokenName,
                'coin_symbol':item.tokenSymbol,
                'divisor':item.tokenDivisor
            })
        }
    } catch (e) {
        console.error('error', e)
    }
}
    }
    for (let index = 1; index <= contractaddresses.length; index++) {
        await getData(contractaddresses[index], index)
    }
    return result
}

const getTokenInfoFromContractAddress = async (balance) => {
    let result = [];
      await Promise.all(balance.map(async (curr) => {
            const currentRes ={
                'img':`https://ftmscan.com/token/images/${curr.coin_name.toLowerCase()}_32.png`,
                'coin':curr.coin_symbol,
                'balance':(curr.balance/Math.pow(10,curr.divisor)).toString().includes('e-')? 0:curr.balance/Math.pow(10,curr.divisor),
                'coin_address': curr.coin_address
            }
          result.push({...currentRes})

    }));
    return result
}
export {
    getAddressTransferEvents,
    getTokenBalanceFromContractAddress,
    getTokenInfoFromContractAddress,
    getListContractAddresses
}
