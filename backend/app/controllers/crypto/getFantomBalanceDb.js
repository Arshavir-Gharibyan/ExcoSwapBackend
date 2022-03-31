import jwt from "jsonwebtoken";
import Web3 from "web3";
const REACT_APP_API_URL_WEB3 = 'https://rpc.testnet.fantom.network/'
const web3 = new Web3(new Web3.providers.HttpProvider(REACT_APP_API_URL_WEB3 || ''));
const getBalance = async (address) => {
    const res = web3.utils.fromWei(await web3.eth.getBalance(address))
    return res;
}
const axios = require('axios');
const User = require("@root/db/models").User
const Wallet = require("@root/db/models").Wallet
const getFantomBalanceDb  =  async (req, res) =>{
    if (req.headers && req.headers.authorization) {
        let authorization = req.headers.authorization.split(' ')[1],
            decoded;
        try {
            decoded = jwt.verify(authorization, process.env.JWT_SECRET_TOKEN);
            let userId = decoded.id;
            const userWallet = await Wallet.findOne({ where: { user_id: userId,type: "FANTOM" } });
            if (userWallet) {
                const address = userWallet.address;
                const response = await getBalance(address)
                return({
                    "fantomBalance": {
                        "balance": response
                    }
                })
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
export { getFantomBalanceDb };


