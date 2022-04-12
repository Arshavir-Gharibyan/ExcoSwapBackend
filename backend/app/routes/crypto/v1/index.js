import { Router } from 'express';
import healthCheck from './healthCheck';
import receiveAddress from './receiveAddress';
import {generBSCWallet} from "./wallet/binanceWallet";
import {generEthWallet} from "./wallet/ethWallet";
import {generMaticWallet} from "./wallet/maticWallet";
import {generSolanaWallet} from "./wallet/solanaWallet";
import {generCELOWallet} from "./wallet/celoWallet";
import {generFantomWallet} from "./wallet/fantomWallet";
import getBitcoinBalance from "./getBitcoinBalance";
import getBinanceBal from "./getBinanceBalance";
import getEthereumBalance from "./getEthereumBalance";
import getCeloBalance from "./getCeloBalance";
import getMaticBalance from "./getMaticBalance";
import getBalance from "./getBalance";
import getWallet        from "./wallet/getWallet";
import getWalletGet        from "./wallet/getWalletGet";
import {generBTCWallet} from "./wallet/bitcoinWallet";
import getSolanaBalance from "./getSolanaBalance";
import swapToken from "./wallet/swapToken";
import getFantomBalance from "./getFantomBalance";
import swapTokensList from "./wallet/swapTokensList";
import importWallet from "./wallet/importWallet";
import sellToken from "./wallet/sellToken";
import OneInchswap from "./wallet/OneInchswap";

const cryptoV1Route = Router();

cryptoV1Route.use('/healthCheck', healthCheck)
cryptoV1Route.use('/receiveAddress', receiveAddress)
/**
 * @swagger
 * /crypto/v1/createWallet:
 *   post:
 *     summary: createWallet
 *     description: createWallet
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 description: The username.
 *                 example: Leanne
 *               firstname:
 *                 type: string
 *                 description: The firstname.
 *                 example: Leanne
 *               lastname:
 *                 type: string
 *                 description: The lastname.
 *                 example: Leanne
 *               email:
 *                 type: string
 *                 description: The email.
 *                 example: test@gmail.com
 *               password:
 *                 type: string
 *                 description: The password.
 *                 example: 123456
 *               seedparse:
 *                 type: string
 *                 description: The seedparse.
 *                 example: zebra parent avocado margin ready heart space orchard police junior travel today bag action rough system novel large rain detail route spare add mail
 *               type:
 *                 type: string
 *                 description: The type.
 *                 example: user
 *     responses:
 *       200:
 *         description: Success.
 *       400:
 *         description: Can't find user
 */
cryptoV1Route.use('/createWallet', getWallet)
/**
 * @swagger
 * /crypto/v1/importWallet:
 *   post:
 *     summary: importWallet
 *     description: importWallet
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 description: The username.
 *                 example: Leanne
 *               firstname:
 *                 type: string
 *                 description: The firstname.
 *                 example: Leanne
 *               lastname:
 *                 type: string
 *                 description: The lastname.
 *                 example: Leanne
 *               email:
 *                 type: string
 *                 description: The email.
 *                 example: test@gmail.com
 *               password:
 *                 type: string
 *                 description: The password.
 *                 example: 123456
 *               seedparse:
 *                 type: string
 *                 description: The seedparse.
 *                 example: zebra parent avocado margin ready heart space orchard police junior travel today bag action rough system novel large rain detail route spare add mail
 *               type:
 *                 type: string
 *                 description: The type.
 *                 example: user
 *     responses:
 *       200:
 *         description: Success.
 *       400:
 *         description: Can't find user
 */
cryptoV1Route.use('/importWallet', importWallet)
/**
 * @swagger
 * /crypto/v1/getBalance:
 *   get:
 *     summary: Returned  bsc and solana tokens
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Success
 *       401:
 *         description: Access token is missing or invalid
 *
 */
cryptoV1Route.use('/getBalance', getBalance)
/**
 * @swagger
 * /crypto/v1/getWallet:
 *   get:
 *     summary: Returned actual addresses for user
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *                type: object
 *                properties:
 *                  BTC:
 *                     type: object
 *                     properties:
 *                       address:
 *                          type: string
 *                          description: The user address.
 *                          example: x7673161CbfE0116A4De9E341f8465940c2211d4
 *                       type:
 *                          type: string
 *                          description: The coin type.
 *                          example: BTC
 *                  ETH:
 *                     type: object
 *                     properties:
 *                       address:
 *                          type: string
 *                          description: The user address.
 *                          example: x7673161CbfE0116A4De9E341f8465940c2211d4
 *                       type:
 *                          type: string
 *                          description: The coin type.
 *                          example: ETH
 *                  BSC:
 *                     type: object
 *                     properties:
 *                       address:
 *                          type: string
 *                          description: The user address.
 *                          example: x7673161CbfE0116A4De9E341f8465940c2211d4
 *                       type:
 *                          type: string
 *                          description: The coin type.
 *                          example: BSC
 *                  MATIC:
 *                     type: object
 *                     properties:
 *                       address:
 *                          type: string
 *                          description: The user address.
 *                          example: x7673161CbfE0116A4De9E341f8465940c2211d4
 *                       type:
 *                          type: string
 *                          description: The coin type.
 *                          example: MATIC
 *       401:
 *         description: Access token is missing or invalid
 *
 */
cryptoV1Route.use('/getWallet', getWalletGet)
// /**
//  * @swagger
//  * /crypto/v1/BSCWallet:
//  *   post:
//  *     summary: Returned BSC actual address for user
//  *     security:
//  *       - bearerAuth: []
//  *     responses:
//  *       200:
//  *         description: Success
//  *         content:
//  *           application/json:
//  *             schema:
//  *                type: object
//  *                properties:
//  *                  data:
//  *                     type: object
//  *                     properties:
//  *                       address:
//  *                          type: string
//  *                          description: The user address.
//  *                          example: x7673161CbfE0116A4De9E341f8465940c2211d4
//  *                       type:
//  *                          type: string
//  *                          description: The coin type.
//  *                          example: BSC
//  *       401:
//  *         description: Access token is missing or invalid
//  *
//  */
cryptoV1Route.use('/BSCWallet', generBSCWallet)
// /**
//  * @swagger
//  * /crypto/v1/BTCWallet:
//  *   post:
//  *     summary: Returned BTC actual address for user
//  *     security:
//  *       - bearerAuth: []
//  *     responses:
//  *       200:
//  *         description: Success.
//  *         content:
//  *           application/json:
//  *             schema:
//  *                type: object
//  *                properties:
//  *                  data:
//  *                     type: object
//  *                     properties:
//  *                       address:
//  *                          type: string
//  *                          description: The user address.
//  *                          example: x7673161CbfE0116A4De9E341f8465940c2211d4
//  *                       type:
//  *                          type: string
//  *                          description: The coin type.
//  *                          example: BTC
//  *       401:
//  *         description: Access token is missing or invalid
//  */
cryptoV1Route.use('/BTCWallet', generBTCWallet)
// /**
//  * @swagger
//  * /crypto/v1/ETHWallet:
//  *   post:
//  *     summary: Returned ETH actual addres for user
//  *     security:
//  *       - bearerAuth: []
//  *     responses:
//  *       200:
//  *         description: Success.
//  *         content:
//  *           application/json:
//  *             schema:
//  *                type: object
//  *                properties:
//  *                  data:
//  *                     type: object
//  *                     properties:
//  *                       address:
//  *                          type: string
//  *                          description: The user address.
//  *                          example: x7673161CbfE0116A4De9E341f8465940c2211d4
//  *                       type:
//  *                          type: string
//  *                          description: The coin type.
//  *                          example: ETH
//  *       401:
//  *         description: Access token is missing or invalid
//  */
cryptoV1Route.use('/ETHWallet', generEthWallet)
// /**
//  * @swagger
//  * /crypto/v1/MATICWallet:
//  *   post:
//  *     summary: Returned MATIC actual address for user
//  *     security:
//  *       - bearerAuth: []
//  *     responses:
//  *       200:
//  *         description: Success.
//  *         content:
//  *           application/json:
//  *             schema:
//  *                type: object
//  *                properties:
//  *                  data:
//  *                     type: object
//  *                     properties:
//  *                       address:
//  *                          type: string
//  *                          description: The user address.
//  *                          example: x7673161CbfE0116A4De9E341f8465940c2211d4
//  *                       type:
//  *                          type: string
//  *                          description: The coin type.
//  *                          example: MATIC
//  *       401:
//  *         description: Access token is missing or invalid
//  */
cryptoV1Route.use('/MATICWallet', generMaticWallet)
// /**
//  * @swagger
//  * /crypto/v1/SOLANAWallet:
//  *   post:
//  *     summary: Returned MATIC actual address for user
//  *     security:
//  *       - bearerAuth: []
//  *     responses:
//  *       200:
//  *         description: Success.
//  *         content:
//  *           application/json:
//  *             schema:
//  *                type: object
//  *                properties:
//  *                  data:
//  *                     type: object
//  *                     properties:
//  *                       address:
//  *                          type: string
//  *                          description: The user address.
//  *                          example: x7673161CbfE0116A4De9E341f8465940c2211d4
//  *                       type:
//  *                          type: string
//  *                          description: The coin type.
//  *                          example: MATIC
//  *       401:
//  *         description: Access token is missing or invalid
//  */
cryptoV1Route.use('/SOLANAWallet', generSolanaWallet)
// /**
//  * @swagger
//  * /crypto/v1/CELOWallet:
//  *   post:
//  *     summary: Returned MATIC actual address for user
//  *     security:
//  *       - bearerAuth: []
//  *     responses:
//  *       200:
//  *         description: Success.
//  *         content:
//  *           application/json:
//  *             schema:
//  *                type: object
//  *                properties:
//  *                  data:
//  *                     type: object
//  *                     properties:
//  *                       address:
//  *                          type: string
//  *                          description: The user address.
//  *                          example: x7673161CbfE0116A4De9E341f8465940c2211d4
//  *                       type:
//  *                          type: string
//  *                          description: The coin type.
//  *                          example: MATIC
//  *       401:
//  *         description: Access token is missing or invalid
//  */
cryptoV1Route.use('/CELOWallet', generCELOWallet)
// /**
//  * @swagger
//  * /crypto/v1/FANTOMWallet:
//  *   post:
//  *     summary: Returned MATIC actual address for user
//  *     security:
//  *       - bearerAuth: []
//  *     responses:
//  *       200:
//  *         description: Success.
//  *         content:
//  *           application/json:
//  *             schema:
//  *                type: object
//  *                properties:
//  *                  data:
//  *                     type: object
//  *                     properties:
//  *                       address:
//  *                          type: string
//  *                          description: The user address.
//  *                          example: x7673161CbfE0116A4De9E341f8465940c2211d4
//  *                       type:
//  *                          type: string
//  *                          description: The coin type.
//  *                          example: MATIC
//  *       401:
//  *         description: Access token is missing or invalid
//  */
cryptoV1Route.use('/FANTOMWallet', generFantomWallet)
// /**
//  * @swagger
//  * /crypto/v1/BTCBalance:
//  *   get:
//  *     summary: Returned  bitcoin balance for user
//  *     security:
//  *       - bearerAuth: []
//  *     responses:
//  *       200:
//  *         description: Success
//  *         content:
//  *           application/json:
//  *             schema:
//  *                type: object
//  *                properties:
//  *                  balance:
//  *                    type: string
//  *                    description: The user balance for bitcoin.
//  *                    example: 0
//  *       401:
//  *         description: Access token is missing or invalid
//  *
//  */
cryptoV1Route.use('/BTCBalance', getBitcoinBalance)
// /**
//  * @swagger
//  * /crypto/v1/BSCBalance:
//  *   get:
//  *     summary: Returned  bnb balance for user
//  *     security:
//  *       - bearerAuth: []
//  *     responses:
//  *       200:
//  *         description: Success
//  *       401:
//  *         description: Access token is missing or invalid
//  *
//  */
cryptoV1Route.use('/BSCBalance', getBinanceBal)
/**
 // * @swagger
 // * /crypto/v1/ETHBalance:
 // *   get:
 // *     summary: Returned  eth balance for user
 // *     security:
 // *       - bearerAuth: []
 // *     responses:
 // *       200:
 // *         description: Success
 // *         content:
 // *           application/json:
 // *             schema:
 // *                type: object
 // *                properties:
 // *                  balance:
 // *                    type: string
 // *                    description: The user balance for eth.
 // *                    example: 0
 // *       401:
 // *         description: Access token is missing or invalid
 // *
 // */
cryptoV1Route.use('/ETHBalance', getEthereumBalance)
// /**
//  * @swagger
//  * /crypto/v1/CELOBalance:
//  *   get:
//  *     summary: Returned  celo balance for user
//  *     security:
//  *       - bearerAuth: []
//  *     responses:
//  *       200:
//  *         description: Success
//  *         content:
//  *           application/json:
//  *             schema:
//  *                type: object
//  *                properties:
//  *                  balance:
//  *                    type: string
//  *                    description: The user balance for celo.
//  *                    example: 0
//  *       401:
//  *         description: Access token is missing or invalid
//  *
//  */
cryptoV1Route.use('/CELOBalance', getCeloBalance)
// /**
//  * @swagger
//  * /crypto/v1/MATICBalance:
//  *   get:
//  *     summary: Returned  polygon balance for user
//  *     security:
//  *       - bearerAuth: []
//  *     responses:
//  *       200:
//  *         description: Success
//  *         content:
//  *           application/json:
//  *             schema:
//  *                type: object
//  *                properties:
//  *                  balance:
//  *                    type: string
//  *                    description: The user balance for polygon.
//  *                    example: 0
//  *       401:
//  *         description: Access token is missing or invalid
//  *
//  */
cryptoV1Route.use('/MATICBalance', getMaticBalance)
// /**
//  * @swagger
//  * /crypto/v1/SOLANABalance:
//  *   get:
//  *     summary: Returned  solana balance for user
//  *     security:
//  *       - bearerAuth: []
//  *     responses:
//  *       200:
//  *         description: Success
//  *       401:
//  *         description: Access token is missing or invalid
//  *
//  */
cryptoV1Route.use('/SOLANABalance', getSolanaBalance)
// /**
//  * @swagger
//  * /crypto/v1/FANTOMBalance:
//  *   get:
//  *     summary: Returned  fantom balance for user
//  *     security:
//  *       - bearerAuth: []
//  *     responses:
//  *       200:
//  *         description: Success
//  *         content:
//  *           application/json:
//  *             schema:
//  *                type: object
//  *                properties:
//  *                  balance:
//  *                    type: string
//  *                    description: The user balance for fantom.
//  *                    example: 0
//  *       401:
//  *         description: Access token is missing or invalid
//  *
//  */
cryptoV1Route.use('/FANTOMBalance', getFantomBalance)
/**
 * @swagger
 * /crypto/v1/swapTokensList:
 *   get:
 *     summary: Get all available tokens
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Success
 *       401:
 *         description: Access token is missing or invalid
 *
 */
cryptoV1Route.use('/swapTokensList', swapTokensList)
/**
 * @swagger
 * /crypto/v1/possibleSwap:
 *   post:
 *     summary: returned possible  coin balance after successful swap
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               walletAddress:
 *                 type: string
 *                 description: The walletAddress.
 *                 example: 0x
 *               walletType:
 *                 type: string
 *                 description: The walletType.
 *                 example: ETH
 *               sellTokenSymbol:
 *                 type: string
 *                 description: The sellTokenSymbol.
 *                 example: ETH
 *               sellTokenAddress:
 *                 type: string
 *                 description: The sellTokenAddress.
 *                 example: string
 *               sellTokenDecimals:
 *                 type: string
 *                 description: The sellTokenDecimals.
 *                 example: 18
 *               buyTokenSymbol:
 *                 type: string
 *                 description: The buyTokenSymbol.
 *                 example: DAI
 *               buyTokenAddress:
 *                 type: string
 *                 description: The buyTokenAddress.
 *                 example: string
 *               buyTokenDecimals:
 *                 type: string
 *                 description: The buyTokenDecimals.
 *                 example: 18
 *               sellAmount:
 *                 type: integer
 *                 description: The amount.
 *                 example: 0.1
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *                type: object
 *                properties:
 *                  buyAmount:
 *                    type: string
 *       401:
 *         description: Access token is missing or invalid
 *
 */
cryptoV1Route.use('/possibleSwap', swapToken)
// /**
//  * @swagger
//  * /crypto/v1/swap:
//  *   post:
//  *     summary: Do swap
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             type: object
//  *             properties:
//  *               walletAddress:
//  *                 type: string
//  *                 description: The walletAddress.
//  *                 example: 0x
//  *               walletType:
//  *                 type: string
//  *                 description: The walletType.
//  *                 example: ETH
//  *               sellTokenSymbol:
//  *                 type: string
//  *                 description: The sellTokenSymbol.
//  *                 example: ETH
//  *               sellTokenDecimals:
//  *                 type: string
//  *                 description: The sellTokenDecimals.
//  *                 example: 18
//  *               buyTokenSymbol:
//  *                 type: string
//  *                 description: The buyTokenSymbol.
//  *                 example: DAI
//  *               buyTokenDecimals:
//  *                 type: string
//  *                 description: The buyTokenDecimals.
//  *                 example: 18
//  *               sellAmount:
//  *                 type: integer
//  *                 description: The amount.
//  *                 example: 0.1
//  *     security:
//  *       - bearerAuth: []
//  *     responses:
//  *       200:
//  *         description: Success
//  *       401:
//  *         description: Access token is missing or invalid
//  *
//  */
// cryptoV1Route.use('/swap', sellToken)
/**
 * @swagger
 * /crypto/v1/swap:
 *   post:
 *     summary: swap
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               walletAddress:
 *                 type: string
 *                 description: The walletAddress.
 *                 example: 0x
 *               walletType:
 *                 type: string
 *                 description: The walletType.
 *                 example: ETH
 *               sellTokenSymbol:
 *                 type: string
 *                 description: The sellTokenSymbol.
 *                 example: ETH
 *               sellTokenAddress:
 *                 type: string
 *                 description: The sellTokenAddress.
 *                 example: string
 *               sellTokenDecimals:
 *                 type: string
 *                 description: The sellTokenDecimals.
 *                 example: 18
 *               buyTokenSymbol:
 *                 type: string
 *                 description: The buyTokenSymbol.
 *                 example: DAI
 *               buyTokenAddress:
 *                 type: string
 *                 description: The buyTokenAddress.
 *                 example: string
 *               buyTokenDecimals:
 *                 type: string
 *                 description: The buyTokenDecimals.
 *                 example: 18
 *               sellAmount:
 *                 type: integer
 *                 description: The amount.
 *                 example: 0.1
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Success
 *       401:
 *         description: Access token is missing or invalid
 *
 */
cryptoV1Route.use('/swap', OneInchswap)
export default cryptoV1Route;
