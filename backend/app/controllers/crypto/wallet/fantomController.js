import {getUserByJwt} from "../../../services/userService";
import {getWalletAddressFantom, getWalletAddressSOLANA, getWalletPrivKey} from "../../../services/tatumService";
import {findWalletByType} from "../../../services/walletService";
import {
    getAddressTransferEvents,
    getTokenBalanceFromContractAddress,
    getTokenInfoFromContractAddress
} from "../../../services/ftmscanService";
import {getListContractAddresses} from "../../../services/etherscanService";

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
        }) ;
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
            const tokenTransferEvents = await getAddressTransferEvents(walletFantom[0].address)
            const contractAddresses = await getListContractAddresses(tokenTransferEvents.data)
            const balance = await getTokenBalanceFromContractAddress(contractAddresses,walletFantom[0].address)
            const tokenInfo = await getTokenInfoFromContractAddress(balance)
            if(tokenInfo && Object.keys(tokenInfo).length){
                if(all){
                    return({
                        'fantomBalance':
                            {
                                'address':walletFantom[0].address,
                                'result':tokenInfo
                            }
                    })
                }
                res.status('200').send({
                    'fantomBalance':
                        {
                            'address':walletFantom[0].address,
                            'result':tokenInfo
                        }
                })
            }else{
                if(all){
                    return({
                        'ethBalance':
                            {
                                'address':walletFantom[0].address,
                                'result':'No token found'
                            }
                    })
                }
                res.status('200').send({
                    'ethBalance':
                        {
                            'address':walletFantom[0].address,
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
