import jwt from "jsonwebtoken";
const User = require("@root/db/models").User;
const Wallet = require("@root/db/models").Wallet;
const getUserByJwt =  async (req) =>{
    let authorization = req.headers.authorization.split(' ')[1],
        decoded;
    try {
        decoded = jwt.verify(authorization, process.env.JWT_SECRET_TOKEN);
        let userId = decoded.id;
        const user = await User.findByPk(userId);
        if (user) {
            return user;
        } else {
            return false;
        }
    }catch (e) {
        return({
            error: "unauthorized"
        });
    }
}
const getUserWalletPrivKey =  async (user_id, walletType) =>{

    try {
        const userPrivKey = await  Wallet.findOne({
            where: {
                user_id: user_id,
                type: walletType
            }
        });
        if (userPrivKey) {
            return userPrivKey;
        } else {
            return false;
        }
    }catch (e) {
        return({
            error: "unauthorized"
        });
    }
}
export {getUserByJwt, getUserWalletPrivKey}
