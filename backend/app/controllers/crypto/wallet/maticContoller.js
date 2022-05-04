import {getUserByJwt} from "../../../services/userService";
import {
    getAddressBalance,
    getWalletAddressEth,
    getWalletAddressMatic, getWalletPrivKey,
    getWalletXpubETH,
    getWalletXpubMATIC
} from "../../../services/tatumService";
import {findWalletByType} from "../../../services/walletService";
import {
    getAddressTransferEvents,
    getListContractAddresses,
    getTokenBalanceFromContractAddress, getTokenInfoFromContractAddress
} from "../../../services/polygonscanService";
import {getTokensBalanceMoralis} from "../../../services/moralisApiService";
const generateMATICWallet  =  async (req, res,  all=false) =>{
    if (req.headers && req.headers.authorization) {
        const user = await getUserByJwt(req);
        if(user){
            const response = await getWalletXpubMATIC(user.seedPhrase)
            if (response) {
                const address = await getWalletAddressMatic(response.data.xpub);
                if (address){
                    address.data.type = "MATIC";
                    if(all){
                        return({
                            MATIC: address.data
                        });
                    }
                    res.status('200').send({
                        MATIC: address.data
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
const importMATICWallet  =  async (seedPharse) =>{
    const response = await getWalletXpubMATIC(seedPharse)
    if (response){
        const address = await getWalletAddressMatic(response.data.xpub);
        const priv_key = await getWalletPrivKey(seedPharse,'matic')
        if (address){
            address.data.type = "MATIC";
            address.data.priv_key =priv_key.data.key
            return({
                MATIC: address.data
            })
        }
    }
}
const getMaticBalance =  async (req, res, all=false) =>{
    if (req.headers && req.headers.authorization) {
        const user = await getUserByJwt(req);
        if(user){
            const walletMatic = await findWalletByType(user.id, 'MATIC');
            // const tokenTransferEvents = await getAddressTransferEvents(walletMatic[0].address)
            // const contractAddresses = await getListContractAddresses(tokenTransferEvents.data)
            // const balance = await getTokenBalanceFromContractAddress(contractAddresses,walletMatic[0].address)
            // const tokenInfo = await getTokenInfoFromContractAddress(balance)
            const balance = await  getTokensBalanceMoralis('polygon', walletMatic[0].address)
            const addressBalance = await getAddressBalance(walletMatic[0].address,'polygon')
            if(balance && Object.keys(balance).length){
                if(all){
                    return ({
                        'maticBalance':
                            {
                                'address':walletMatic[0].address,
                                'addressBalance':addressBalance.data.balance,
                                'result':balance
                            }
                    })
                }
                res.status('200').send({
                    'maticBalance':
                        {
                            'address':walletMatic[0].address,
                            'addressBalance':addressBalance.data.balance,
                            'result':balance
                        }
                })
            }else{
                if (all){
                    return({
                        'maticBalance':
                            {
                                'address':walletMatic[0].address,
                                'addressBalance':addressBalance.data.balance,
                                'result':'No token found'
                            }
                    })
                }
                res.status('200').send({
                    'maticBalance':
                        {
                            'address':walletMatic[0].address,
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
export { generateMATICWallet,importMATICWallet, getMaticBalance};
