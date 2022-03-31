import {getUserByJwt} from "../../../services/userService";
import {
    getAddressBalance,
    getWalletAddressBsc,
    getWalletPrivKey,
    getWalletXpubBSC
} from "../../../services/tatumService";
import {findWalletByType, findWalletByUserId} from "../../../services/walletService";
import {addressTokenBalanceBSC, getBalanceFromHolding} from "../../../services/bscscanService";

const generateBSCWallet  =  async (req, res, all=false) =>{
    if (req.headers && req.headers.authorization) {
        const user = await getUserByJwt(req);
        if(user){
            const response = await getWalletXpubBSC(user.seedPhrase)
            if (response) {
                const address = await getWalletAddressBsc(response.data.xpub);
                if (address){
                    address.data.type = "BSC";
                    if (all){
                        return({
                            BSC: address.data
                        })
                    }
                    res.status('200').send({
                        BSC: address.data
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
            });
        }
        res.status('401').send({
            error: "unauthorized"
        });
    }
}
const importBSCWallet  =  async (seedPharse) =>{
    const response = await getWalletXpubBSC(seedPharse)
    if (response){
        const address = await getWalletAddressBsc(response.data.xpub);
        const priv_key = await getWalletPrivKey(seedPharse,'bsc')
        if (address){
            address.data.type = "BSC";
            address.data.priv_key =priv_key.data.key
            return({
                BSC: address.data,
            })
        }
   }
}
const getBinanceBalance =  async (req, res, all=false) =>{
    if (req.headers && req.headers.authorization) {
        const user = await getUserByJwt(req);
        if(user){
            const walletBcs = await findWalletByType(user.id, 'BSC');
            const tokenHolding = await addressTokenBalanceBSC(walletBcs[0].address);
            const balance = await getBalanceFromHolding(tokenHolding.data.result);
            const addressBalance = await getAddressBalance(walletBcs[0].address,'bsc')
            if(balance){
                if(all){
                    return ({
                        'bscBalance':
                            {
                                'address':walletBcs[0].address,
                                'addressBalance':addressBalance.data.balance,
                                'result':balance
                            }
                    })
                }
                res.status('200').send({
                    'bscBalance':
                        {
                            'address':walletBcs[0].address,
                            'addressBalance':addressBalance.data.balance,
                            'result':balance
                        }
                })
            }else{
                if (all){
                    return({
                        'bscBalance':
                            {
                                'address':walletBcs[0].address,
                                'addressBalance':addressBalance.data.balance,
                                'result':'No token found'
                            }
                    })
                }
                res.status('200').send({
                    'bscBalance':
                        {
                            'address':walletBcs[0].address,
                            'addressBalance':addressBalance.data.balance,
                            'result':'No token found'
                        }
                })
            }

        }
        else{
            if(all){
                return({
                    error: "unauthorized"
                }) ;
            }
            res.status('401').send({
                error: "unauthorized"
            }) ;
        }
    }
    else{
        if (all){
            return({
                error: "unauthorized"
            });
        }
        res.status('401').send({
            error: "unauthorized"
        });
    }
}
export { generateBSCWallet, getBinanceBalance,importBSCWallet};
