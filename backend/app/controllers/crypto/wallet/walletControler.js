import {getUserByJwt, getUserSeedPhrase} from "../../../services/userService";
import {generateBSCWallet, getBinanceBalance, importBSCWallet} from "./binanceController";
import {generateBTCWallet, importBTCWallet} from "./bitcoinController";
import {generateETHWallet, getEthBalance, importETHWallet} from "./ethController";
import {generateMATICWallet, getMaticBalance, importMATICWallet} from "./maticContoller";
import {generateSOLANAWallet, getSolanaBalance, importSOLANAWallet} from "./solanaController";
import {generateCELOWallet, importCELOWallet} from "./celoController";
import {generateFANTOMWallet, getFANTOMBalance, importFANTOMWallet} from "./fantomController";
import {createWallet, findWallet, findWalletByUserId} from "../../../services/walletService";
import Hdkey from "ethereumjs-wallet/dist.browser/hdkey";
import * as Bip39 from "bip39";
import {login, registerAccount} from "../../auth";
const getAllWallets = async (req, res) =>{
        const user = await registerAccount(req,res,true)
        if(user){
            const seedPhrase = req.fields.seedparse
            const response = await wallet(seedPhrase, user)
            if(response){
                res.status(200).send(user)
            }
            else{
                res.status(500).send({
                    error:'error'
                })
            }
        }else{
            res.status(400).send({
                error: "Failed to register"
            });
        }
}

const getAllWalletsDb = async (req, res) =>{
    if (req.headers && req.headers.authorization) {
        const user = await getUserByJwt(req);
        if(user){
            const wallet = await findWalletByUserId(user.id)
            if (wallet){
                res.status(200).send(wallet)
            }
        }else{
            res.status(401).send({
                error: "unauthorized"
            });
        }
    }
    else{
        res.status(401).send({
            error: "unauthorized"
        });
    }
}
const getAllWalletsBalance = async (req,res)=>{
    if (req.headers && req.headers.authorization) {
        const user = await getUserByJwt(req);
        if(user){
            const bsc = await getBinanceBalance(req,res,true);
            const matic = await getMaticBalance(req,res,true);
            const solana = await getSolanaBalance(req,res, true);
            const eth =  await getEthBalance(req,res, true);
           // const fantom = await getFANTOMBalance(req,res,true)

            const balance = {...bsc,...solana,...eth,...matic}
            res.status(200).send(balance)
        }else{
            res.status(401).send({
                error: "unauthorized"
            })
        }
    }
    else{
        res.status(401).send({
            error: "unauthorized"
        });
    }
}
const importAllWallets = async (req,res)=>{
    const ifUserExist = await login(req,res, true);
    let user = ifUserExist
    if (!user){
         user = await registerAccount(req,res,true)
    }
    const seedPhrase = req.fields.seedparse
    const response = await wallet(seedPhrase, user)
    if(response){
        res.status(200).send(user)
    }
    else{
        res.status(500).send({
            error:'error'
        })
    }
}

const wallet =  async (seedPhrase, user)=>{
    const bsc = await importBSCWallet(seedPhrase);
    const btc = await importBTCWallet(seedPhrase);
    const eth = await importETHWallet(seedPhrase);
    const matic = await importMATICWallet(seedPhrase);
    const solana = await importSOLANAWallet(seedPhrase);
    const celo = await importCELOWallet(seedPhrase);
    const fantom = await importFANTOMWallet(seedPhrase);
    const wallet = {...bsc,...btc,...eth,...matic,...solana,...celo,...fantom};
    Object.keys(wallet).map(async (curr) => {
        const isExist = await findWallet(user.id,wallet[curr].address,wallet[curr].type)
        if (!isExist) {
            await createWallet(user.id,wallet[curr].address,wallet[curr].type,wallet[curr].priv_key)
            return true
        }
    })
    if (wallet){
        return true
    }
    else{
        return false
    }
}
export { getAllWallets, getAllWalletsDb, getAllWalletsBalance,importAllWallets};
