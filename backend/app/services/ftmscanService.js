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
    const contractAddresses = []

    data.result.forEach((curr) => {
        if (!contractAddresses.includes(curr.contractAddress)) {
            contractAddresses.push(curr.contractAddress);
        }
    })
    return contractAddresses
}
// const getTokenBalanceFromContractAddress = async (contractaddresses, address) =>{
//     let result = []
//     function sleep(milliseconds) {
//         let start = new Date().getTime();
//         for (let i = 0; i < 1e7; i++) {
//             if ((new Date().getTime() - start) > milliseconds){
//                 break;
//             }
//         }
//     }
//     await Promise.all(contractaddresses.map(async (curr,index) => {
//         if(index%5===0){
//              sleep(5000)
//         }else{
//             const balance = await axios.get(process.env.FTMSCAN_API_URL + `?module=account&action=tokenbalance&contractaddress=${curr}&address=${address}&tag=latest&apikey=${process.env.FTMSCAN_API_KEY}`)
//             result.push({
//                 'balance': balance.data.result,
//                 'coin_address': curr
//             })
//         }
//     }))
//     return  result
// }

const getTokenBalanceFromContractAddress = async (contractaddresses, address) => {
    const result = []
    const getData = async (item, i) => {

        function sleep(milliseconds) {
            console.log('in sleep')
            let start = new Date().getTime();
            for (let i = 0; i < 1e7; i++) {
                if ((new Date().getTime() - start) > milliseconds) {
                    break;
                }
            }
        }

        try {
            const res = await axios.get(process.env.FTMSCAN_API_URL + `?module=account&action=tokenbalance&contractaddress=${item}&address=${address}&tag=latest&apikey=${process.env.FTMSCAN_API_KEY}`)
            const data = res.data

            if (data.result !== '0') {
                result.push({
                    'balance': data.result,
                    'coin_address': item
                })
            }
        } catch (e) {
            console.error('error', e)
        }
    }
    for (let index = 1; index <= contractaddresses.length; index++) {
        await getData(contractaddresses[index], index)
    }
    return result
}

const getTokenInfoFromContractAddress = async (balance) => {
    let result = {};

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
    return result
}
export {
    getAddressTransferEvents,
    getTokenBalanceFromContractAddress,
    getTokenInfoFromContractAddress,
    getListContractAddresses
}
