import {getUserByJwt} from "../../../services/userService";
import {
    getAddressBalance,
    getWalletAddressAvax,
    getWalletPrivKey
} from "../../../services/tatumService";
import {findWalletByType} from "../../../services/walletService";
import {getAddressBalanceMoralis, getTokensBalanceMoralis} from "../../../services/moralisApiService";

const generateAVAXWallet  =  async (req, res,  all=false) =>{
    if (req.headers && req.headers.authorization) {
        const user = await getUserByJwt(req);
        if(user){
            const response = await getWalletAddressAvax(user.seedPhrase)
            if (all){
                return({
                    "AVAX":{
                        "address":response,
                        "type":"AVAX"
                    }
                });
            }
            res.status('202').send({
                "AVAX":{
                    "address":response,
                    "type":"AVAX"
                }
            });
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
        })
    }
}
const importAVAXWallet  =  async (seedPharse) =>{
    const response = await getWalletAddressAvax(seedPharse)
    const priv_key = await getWalletPrivKey(seedPharse,'fantom')
    if (response){
        return({
            "AVAX":{
                "address":response,
                "type":"AVAX",
                "priv_key":priv_key
            }
        });
    }
}
const getAVAXBalance =  async (req, res, all=false) =>{
    if (req.headers && req.headers.authorization) {
        const user = await getUserByJwt(req);
        if(user){
            const walletAvax = await findWalletByType(user.id, 'AVAX');
            const balance = await  getTokensBalanceMoralis('avax', walletAvax[0].address)
            const addressBalance = await getAVXBalance(walletAvax[0].address)
            if(balance && Object.keys(balance).length){
                if(all){
                    return({
                        'avaxBalance':
                            {
                                'address':walletAvax[0].address,
                                'addressBalance':addressBalance,
                                'result':balance
                            }
                    })
                }
                res.status('200').send({
                    'avaxBalance':
                        {
                            'address':walletAvax[0].address,
                            'addressBalance':addressBalance,
                            'result':balance
                        }
                })
            }else{
                if(all){
                    return({
                        'avaxBalance':
                            {
                                'address':walletAvax[0].address,
                                'addressBalance':addressBalance,
                                'result':'No token found'
                            }
                    })
                }
                res.status('200').send({
                    'avaxBalance':
                        {
                            'address':walletAvax[0].address,
                            'addressBalance':addressBalance,
                            'result':'No token found'
                        }
                })
            }
        }
        else{
            if (all){
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
export { generateAVAXWallet,
    getAVAXBalance,
    importAVAXWallet}
