import jwt from "jsonwebtoken";
const axios = require('axios');
const User = require("@root/db/models").User
const Wallet = require("@root/db/models").Wallet
const getMaticBalanceDb  =  async (req, res) =>{
    if (req.headers && req.headers.authorization) {
        let authorization = req.headers.authorization.split(' ')[1],
            decoded;
        try {
            decoded = jwt.verify(authorization, process.env.JWT_SECRET_TOKEN);
            let userId = decoded.id;
            const userWallet = await Wallet.findOne({ where: { user_id: userId,type: "MATIC" } });
            if (userWallet) {
                const address = userWallet.address;
                const response = await axios.get(process.env.TATUM_API_URL + '/v3/polygon/account/balance/' + address,
                    {
                        headers: {
                            'x-api-key': process.env.TATUM_API_KEY
                        }
                    });
                if (response) {
                   return({
                       "maticBalance": {
                           "balance": response.data.balance
                       }
                    })
                } else {
                    return({
                        error:"Forbidden"
                    });
                }
            } else {
                return({
                    error: "user don't have Wallet"
                });
            }
        } catch (e) {
            return({
                error: "unauthorized"
            });
        }
    }
    else{
        return({
            error: "unauthorized"
        });
    }

};
export { getMaticBalanceDb };


