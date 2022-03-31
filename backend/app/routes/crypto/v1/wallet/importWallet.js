import { importAllWallets } from '../../../../controllers/crypto/wallet/walletControler';
import { Router } from 'express';
import asyncHandler from 'express-async-handler';
const importWallet = Router();

importWallet.post('/', asyncHandler(importAllWallets));

export default importWallet;
