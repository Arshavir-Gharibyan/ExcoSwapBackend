import {getUserByJwt} from "../../../services/userService";
import {
    getWalletAddressEth,
    getWalletAddressMatic, getWalletPrivKey,
    getWalletXpubETH,
    getWalletXpubMATIC
} from "../../../services/tatumService";

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
export { generateMATICWallet,importMATICWallet};
