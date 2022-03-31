import { Router } from 'express';
import asyncHandler from 'express-async-handler';
import { generateETHWallet } from '../../../../controllers/crypto/wallet/ethController';

const generEthWallet = Router();

generEthWallet.post('/', asyncHandler(generateETHWallet));

export{generEthWallet};
