const solanaWeb3 = require('@solana/web3.js');
const axios = require('axios');
const url ='https://cdn.jsdelivr.net/gh/solana-labs/token-list@main/src/tokens/solana.tokenlist.json';
const Solana = new solanaWeb3.Connection(
    "https://rough-silent-shape.solana-mainnet.quiknode.pro/43c04ea46b6f7b073cf53f35aff8c3b6a413820b/"
);
const addressTokenBalanceSOLANA = async (address)=>{
    const getMetaDataOfToken = async () => {
        return await axios.get(url);
    }

    try {
        const publicKey = new solanaWeb3.PublicKey(address);
        const programId = new solanaWeb3.PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA')
        const response = await Solana.getParsedTokenAccountsByOwner(publicKey,{
        programId: programId
        })
        const tokensArray = response.value;
        if (tokensArray.length ===0){
            return false
        }else{
            const data = await getMetaDataOfToken();
            const { tokens } = data.data;
            const res = [];
            tokensArray.map(item => {
                const body = tokens.filter(it => it.address === item.account.data.parsed.info.mint)
                if (body[0]){
                    res.push({
                        'img': body[0].logoURI,
                        'coin': body[0].symbol,
                        'balance':item.account.data.parsed.info.tokenAmount.uiAmountString,
                        'coin_address':item.account.data.parsed.info.mint
                    })
                }else{
                    res.push({
                        'img': body[0],
                        'coin': body[0],
                        'balance':item.account.data.parsed.info.tokenAmount.uiAmountString,
                        'coin_address':item.account.data.parsed.info.mint
                    })
                }

            })
             return res
        }
    } catch (error) {
        return(error)
    }
}
const getAddressBalance = async (address)=>{
    const publicKey = new solanaWeb3.PublicKey(address);
    return await Solana.getBalance(publicKey)
}
export {addressTokenBalanceSOLANA,getAddressBalance}
