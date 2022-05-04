import axios from "axios";

const getTokensBalanceMoralis = async (chainType,address)=>{
    let result = [];
    const emptyToken ={
        eth: 'https://etherscan.io/images/main/empty-token.png',
        bsc: 'https://bscscan.com/images/main/empty-token.png',
        polygon: 'https://polygonscan.com/images/main/empty-token.png',
        fantom: 'https://ftmscan.com/images/main/empty-token.png',
        solana:'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png'
    }
    try {
        const balance = await axios.get(process.env.MORALIS_API_URL +`/${address}/erc20?chain=${chainType}`,{
                headers: {
                    'X-API-Key': process.env.MORALIS_API_KEY
                }
            }
        );
        const balanceData = balance.data
        await Promise.all(balanceData.map(async (curr) => {
            if (curr.logo){
                const currentRes ={
                    'img':curr.logo,
                    'coin':curr.symbol,
                    'balance':curr.balance/Math.pow(10,curr.decimals),
                    'coin_address': curr.token_address
                }
                result.push({...currentRes})
            }
            else{
                const currentRes ={
                    'img':emptyToken[chainType],
                    'coin':curr.symbol,
                    'balance':curr.balance/Math.pow(10,curr.decimals),
                    'coin_address': curr.token_address
                }
                result.push({...currentRes})
            }
        }));
        return result
    } catch (error) {
        return(error)
    }
}
const getAddressBalanceMoralis = async (chainType,address)=>{
    try {
        const balance = await axios.get(process.env.MORALIS_API_URL +`/${address}/erc20?chain=${chainType}`,{
                headers: {
                    'X-API-Key': process.env.MORALIS_API_KEY
                }
            }
        );
        return balance.data
    } catch (error) {
        return(error)
    }
}

const getSolanaTokensBalanceMoralis = async (chainType,address)=>{
    try {
        const balance = await axios.get(process.env.MORALIS_SOLANA_API_URL +`/${address}/tokens`,{
                headers: {
                    'X-API-Key': process.env.MORALIS_API_KEY
                }
            }
        );
        return balance.data
    } catch (error) {
        return(error)
    }
}
export {getTokensBalanceMoralis,getAddressBalanceMoralis,getSolanaTokensBalanceMoralis}