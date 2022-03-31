import axios from "axios";
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
const addressTokenBalanceBSC = async (address)=>{
    try {
      return await axios.get(process.env.BSCSCAN_API_URL +`?module=account&action=addresstokenbalance&address=${address}&page=1&offset=100&apikey=${process.env.BSCSCAN_API_KEY}`,
        );
    } catch (error) {
        return(error)
    }
}
const getBalanceFromHolding = async (tokenHoldingResult)=>{
    function balanceOfToken(item) {
        const img = imageExists(`https://bscscan.com/token/images/${item.TokenSymbol.toLowerCase()==='nft'?'apenft':item.TokenSymbol.toLowerCase()}_32.png`);
      return ({
                  'img': img?`https://bscscan.com/token/images/${item.TokenSymbol.toLowerCase()==='nft'?'apenft':item.TokenSymbol.toLowerCase()}_32.png`:'https://bscscan.com/images/main/empty-token.png',
                  'coin':item.TokenSymbol,
                  'balance':(item.TokenQuantity/Math.pow(10,item.TokenDivisor)).toString().includes('e-')? 0:item.TokenQuantity/Math.pow(10,item.TokenDivisor),
                  'coin_address':item.TokenAddress
      })
    }
    function imageExists(image_url){

        let http = new XMLHttpRequest();

        http.open('HEAD', image_url, false);
        http.send();

        return http.status != 302;

    }
    if (tokenHoldingResult.length ===0){
     return false
 }else{
     const response = tokenHoldingResult.map(balanceOfToken);
     return response
 }
}
export {addressTokenBalanceBSC,getBalanceFromHolding}
