import {getUserByJwt} from "../../../services/userService";
import {
    getAddressBalance,
    getWalletAddressFantom,
    getWalletAddressSOLANA,
    getWalletPrivKey
} from "../../../services/tatumService";
import {findWalletByType} from "../../../services/walletService";
import {
    getAddressTransferEvents,
    getTokenBalanceFromContractAddress,
    getTokenInfoFromContractAddress,
    getListContractAddresses, getFTMBalance
} from "../../../services/ftmscanService";
import {getAddressBalanceMoralis, getTokensBalanceMoralis} from "../../../services/moralisApiService";
//import {getListContractAddresses} from "../../../services/etherscanService";

const generateFANTOMWallet  =  async (req, res,  all=false) =>{
    if (req.headers && req.headers.authorization) {
        const user = await getUserByJwt(req);
        if(user){
            const response = await getWalletAddressFantom(user.seedPhrase)
            if (all){
                return({
                    "FANTOM":{
                        "address":response,
                        "type":"FANTOM"
                    }
                });
            }
            res.status('202').send({
                    "FANTOM":{
                        "address":response,
                        "type":"FANTOM"
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
const importFANTOMWallet  =  async (seedPharse) =>{
    const response = await getWalletAddressFantom(seedPharse)
    const priv_key = await getWalletPrivKey(seedPharse,'fantom')
    if (response){
        return({
            "FANTOM":{
                "address":response,
                "type":"FANTOM",
                "priv_key":priv_key
            }
        });
    }
}
const getFANTOMBalance =  async (req, res, all=false) =>{
    if (req.headers && req.headers.authorization) {
        const user = await getUserByJwt(req);
        if(user){
            const walletFantom = await findWalletByType(user.id, 'FANTOM');
            // const tokenTransferEvents = await getAddressTransferEvents(walletFantom[0].address)
            //
            // const contractAddresses = await getListContractAddresses(tokenTransferEvents.data)
            // const balance = await getTokenBalanceFromContractAddress(contractAddresses,walletFantom[0].address)
            // // console.log(balance,'balance')
            // const tokenInfo = await getTokenInfoFromContractAddress(balance)
            const balance = await  getTokensBalanceMoralis('fantom', walletFantom[0].address)
            const addressBalance = await getFTMBalance(walletFantom[0].address)
            if(balance && Object.keys(balance).length){
                if(all){
                    return({
                        'fantomBalance':
                            {
                                'address':walletFantom[0].address,
                                'addressBalance':addressBalance,
                                'result':balance
                            }
                    })
                }
                res.status('200').send({
                    'fantomBalance':
                        {
                            'address':walletFantom[0].address,
                            'addressBalance':addressBalance,
                            'result':balance
                        }
                })
            }else{
                if(all){
                    return({
                        'fantomBalance':
                            {
                                'address':walletFantom[0].address,
                                'addressBalance':addressBalance,
                                'result':'No token found'
                            }
                    })
                }
                res.status('200').send({
                    'fantomBalance':
                        {
                            'address':walletFantom[0].address,
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
export { generateFANTOMWallet,getFANTOMBalance,importFANTOMWallet};
