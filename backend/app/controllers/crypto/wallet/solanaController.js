import {getUserByJwt} from "../../../services/userService";
import {
    getWalletAddressCelo,
    getWalletAddressSOLANA, getWalletPrivKey,
    getWalletXpubCELO
} from "../../../services/tatumService";
import {findWalletByType} from "../../../services/walletService";
import {addressTokenBalanceSOLANA, getAddressBalance, getBalanceFromHolding} from "../../../services/quicknodeService";
import {
    getListContractAddresses,
    getTokenBalanceFromContractAddress,
    getTokenInfoFromContractAddress
} from "../../../services/etherscanService";
import {getSolanaTokensBalanceMoralis, getTokensBalanceMoralis} from "../../../services/moralisApiService";
const generateSOLANAWallet  =  async (req, res, all=false) =>{
    if (req.headers && req.headers.authorization) {
        const user = await getUserByJwt(req);
        if(user){
            const response = await getWalletAddressSOLANA(user.seedPhrase)
            if(all){
                return({
                    "SOLANA":{
                        "address":response,
                        "type":"SOLANA"
                    }
                });
            }
            res.status('202').send({
                "SOLANA":{
                    "address":response,
                    "type":"SOLANA"
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
const importSOLANAWallet  =  async (seedPharse) =>{
    const response = await getWalletAddressSOLANA(seedPharse)
    const priv_key = await getWalletPrivKey(seedPharse,'solana')
    if (response){
        return({
            "SOLANA":{
                "address":response,
                "type":"SOLANA",
                'priv_key':priv_key
            }
        })
    }
}
const getSolanaBalance = async (req,res,all=false)=>{
    if (req.headers && req.headers.authorization) {
        const user = await getUserByJwt(req);
        if(user){
            const walletSolana = await findWalletByType(user.id, 'SOLANA');
            const tokenHolding = await addressTokenBalanceSOLANA(walletSolana[0].address);
            const addressBalance = await getAddressBalance(walletSolana[0].address,'sol')

            // const tokenTransferEvents = await getAddressTransferEvents(walletSolana[0].address)
            // console.log(tokenTransferEvents,5555)
            // const addresses = await getListContractAddresses(tokenTransferEvents.data)
            // const balance = await getTokenBalanceFromAddress(addresses,walletSolana[0].address)
            // const tokenInfo = await getTokenInfoFromAddress(balance)

            if(tokenHolding){
                if (all){
                    return({
                        'solanaBalance':
                            {
                                'address':walletSolana[0].address,
                                'addressBalance':addressBalance,
                                'result':tokenHolding
                            }
                    })
                }
                if(all){
                    return({
                        'solanaBalance':
                            {
                                'address':walletSolana[0].address,
                                'addressBalance':addressBalance,
                                'result':tokenHolding
                            }
                    })
                }
                res.status('200').send({
                    'solanaBalance':
                        {
                            'address':walletSolana[0].address,
                            'addressBalance':addressBalance,
                            'result':tokenHolding
                        }
                })
            }else{
                if(all){
                    return({
                        'solanaBalance':
                            {
                                'address':walletSolana[0].address,
                                'addressBalance':addressBalance,
                                'result':'No token found'
                            }
                    })
                }
                res.status('200').send({
                    'solanaBalance':
                        {
                            'address':walletSolana[0].address,
                            'addressBalance':addressBalance,
                            'result':'No token found'
                        }
                })
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
export { generateSOLANAWallet,getSolanaBalance,importSOLANAWallet};
