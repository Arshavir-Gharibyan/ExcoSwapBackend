import axios from "axios"
const getAVXBalance = async(address)=>{
    const res = await axios.get(process.env.SNOW_TRACE_API_URL + `?module=account&action=balance&address=${address}&tag=latest&apikey=${process.env.SNOW_TRACE_API_KEY}`)
    return res.data.result/Math.pow(10,18)
}
export {
    getAVXBalance
}
