import {getUserByJwt} from "../../../services/userService";
import {
    getWalletAddressBsc, getWalletAddressBTC,
    getWalletAddressBtc, getWalletPrivKey,
    getWalletXpubBSC,
    getWalletXpubBTC
} from "../../../services/tatumService";

const generateBTCWallet  =  async (req, res, all=false) =>{
    if (req.headers && req.headers.authorization) {
        const user = await getUserByJwt(req);
        if(user){
            const response = await getWalletXpubBTC(user.seedPhrase)
            if (response) {
                const address = await getWalletAddressBtc(response.data.xpub);
                if (address){
                    address.data.type = "BTC";
                    if(all){
                        return({
                            BTC: address.data
                        });
                    }
                    res.status('200').send({
                        BTC: address.data
                    });
                }
            }else{
                if (all){
                    return({
                        error: "Forbidden"
                    });
                }
                res.status('403').send({
                    error: "Forbidden"
                });
            }
        }
        else {
            if(all){
                return({
                    error: "unauthorized"
                })
            }
            res.status('401').send({
                error: "unauthorized"
            }) ;
        }
    }
    else{
        if(all){
            return({
                error: "unauthorized"
            })
        }
        res.status('401').send({
            error: "unauthorized"
        }) ;
    }
}
const importBTCWallet  =  async (seedPharse) =>{
    const response = await getWalletAddressBTC(seedPharse)
    const priv_key = await getWalletPrivKey(seedPharse,'btc')
    if (response){
        return({
            "BTC":{
                "address":response,
                "type":"BTC",
                "priv_key":priv_key
            }
        });
    }
}
const getBitcoinBalanceDb  =  async (req, res) =>{

}
export { generateBTCWallet,getBitcoinBalanceDb,importBTCWallet};
