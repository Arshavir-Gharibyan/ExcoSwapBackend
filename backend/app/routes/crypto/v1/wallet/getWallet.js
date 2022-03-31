import { getAllWallets } from '../../../../controllers/crypto/wallet/walletControler';
import { Router } from 'express';
import asyncHandler from 'express-async-handler';
const getWallet = Router();

getWallet.post('/', asyncHandler(getAllWallets));

export default getWallet;
