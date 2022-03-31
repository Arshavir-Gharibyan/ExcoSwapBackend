import { Router } from 'express';
import asyncHandler from 'express-async-handler';
import { generateBTCWallet } from '../../../../controllers/crypto/wallet/bitcoinController';

const generBTCWallet = Router();

generBTCWallet.post('/', asyncHandler(generateBTCWallet));

export {generBTCWallet};
