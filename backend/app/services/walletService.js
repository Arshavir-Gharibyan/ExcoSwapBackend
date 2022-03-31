const Wallet = require("@root/db/models").Wallet
const findWallet =  async (user_id,address,type) =>{
   return Wallet.findOne({
       where: {
           user_id: user_id,
           address: address,
           type: type
       }
   });
}
const findWalletByUserId =  async (user_id) =>{
    return Wallet.findAll({ where: { user_id: user_id },  attributes: ['address', 'type'] });
}
const findWalletByType =  async (user_id, type) =>{
    return Wallet.findAll({ raw: true, where: { user_id: user_id, type:type },  attributes: ['address'] });
}
const createWallet =  async (user_id,address,type,priv_key) =>{
    return  Wallet.create({
        user_id: user_id,
        address: address,
        type: type,
        private_key:priv_key
    })
}
export {findWallet,createWallet,findWalletByUserId,findWalletByType}
