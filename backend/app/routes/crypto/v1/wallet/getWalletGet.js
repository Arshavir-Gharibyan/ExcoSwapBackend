import { getAllWalletsDb } from '../../../../controllers/crypto/wallet/walletControler';
import { Router } from 'express';
import asyncHandler from 'express-async-handler';
const getWalletGet = Router();

getWalletGet.get('/', asyncHandler(getAllWalletsDb));

export default getWalletGet;
