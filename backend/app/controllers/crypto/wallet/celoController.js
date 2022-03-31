import {getUserByJwt} from "../../../services/userService";
import {
    getWalletAddressCelo,
    getWalletAddressMatic, getWalletPrivKey,
    getWalletXpubCELO,
    getWalletXpubMATIC
} from "../../../services/tatumService";

const generateCELOWallet  =  async (req, res,  all =false) =>{
    if (req.headers && req.headers.authorization) {
        const user = await getUserByJwt(req);
        if(user){
            const response = await getWalletXpubCELO(user.seedPhrase)
            if (response) {
                const address = await getWalletAddressCelo(response.data.xpub);
                if (address){
                    address.data.type = "CELO";
                    if(all){
                        return({
                            CELO: address.data
                        });
                    }
                    res.status('200').send({
                        CELO: address.data
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
const importCELOWallet  =  async (seedPharse) =>{
    const response = await getWalletXpubCELO(seedPharse)
    if (response){
        const address = await getWalletAddressCelo(response.data.xpub);
        const priv_key = await getWalletPrivKey(seedPharse,'celo')
        if (address){
            address.data.type = "CELO";
            address.data.priv_key = priv_key.data.key
            return({
                CELO: address.data,
            })
        }
    }
}
export { generateCELOWallet,importCELOWallet};
