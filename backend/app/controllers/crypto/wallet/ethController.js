import {getUserByJwt} from "../../../services/userService";
import {
    getAddressBalance,
    getWalletAddressBtc,
    getWalletAddressEth, getWalletPrivKey,
    getWalletXpubBTC,
    getWalletXpubETH
} from "../../../services/tatumService";
import {findWalletByType} from "../../../services/walletService";
import {
    getAddressTransferEvents,
    getListContractAddresses,
    getTokenBalanceFromContractAddress, getTokenInfoFromContractAddress
} from "../../../services/etherscanService";
const generateETHWallet  =  async (req, res, all=false) =>{
    if (req.headers && req.headers.authorization) {
        const user = await getUserByJwt(req);
        if(user){
            const response = await getWalletXpubETH(user.seedPhrase)
            if (response) {
                const address = await getWalletAddressEth(response.data.xpub);
                if (address){
                    address.data.type = "ETH";
                    if (all){
                       return({
                            ETH: address.data
                        });
                    }
                    res.status('200').send({
                        ETH: address.data
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
const importETHWallet  =  async (seedPharse) =>{
    const response = await getWalletXpubETH(seedPharse)
    if (response){
        const address = await getWalletAddressEth(response.data.xpub);
        const priv_key = await getWalletPrivKey(seedPharse,'ethereum')
        if (address){
            address.data.type = "ETH";
            address.data.priv_key =priv_key.data.key
            return({
                ETH: address.data
            })
        }
    }
}
const getEthBalance =  async (req, res, all=false) =>{
    if (req.headers && req.headers.authorization) {
        const user = await getUserByJwt(req);
        if(user){
            const walletEth = await findWalletByType(user.id, 'ETH');
            const tokenTransferEvents = await getAddressTransferEvents(walletEth[0].address)
            const contractAddresses = await getListContractAddresses(tokenTransferEvents.data)
            const balance = await getTokenBalanceFromContractAddress(contractAddresses,walletEth[0].address)
            const tokenInfo = await getTokenInfoFromContractAddress(balance)
            const addressBalance = await getAddressBalance(walletEth[0].address,'ethereum')
            if(tokenInfo && Object.keys(tokenInfo).length){
                if(all){
                    return({
                        'ethBalance':
                            {
                                'address':walletEth[0].address,
                                'addressBalance':addressBalance.data.balance,
                                'result':tokenInfo
                            }
                    })
                }
                res.status('200').send({
                    'ethBalance':
                        {
                            'address':walletEth[0].address,
                            'addressBalance':addressBalance.data.balance,
                            'result':tokenInfo
                        }
                })
            }else{
                if(all){
                    return({
                        'ethBalance':
                            {
                                'address':walletEth[0].address,
                                'addressBalance':addressBalance.data.balance,
                                'result':'No token found'
                            }
                    })
                }
                res.status('200').send({
                    'ethBalance':
                        {
                            'address':walletEth[0].address,
                            'addressBalance':addressBalance.data.balance,
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
export { generateETHWallet,getEthBalance,importETHWallet};
