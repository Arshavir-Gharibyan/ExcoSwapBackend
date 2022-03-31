import { Router } from 'express';
import asyncHandler from 'express-async-handler';
import { generateBSCWallet } from '../../../../controllers/crypto/wallet/binanceController';

const generBSCWallet = Router();

generBSCWallet.post('/', asyncHandler(generateBSCWallet));

export{generBSCWallet};
