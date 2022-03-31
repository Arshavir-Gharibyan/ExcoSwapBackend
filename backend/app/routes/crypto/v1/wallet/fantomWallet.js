import { Router } from 'express';
import asyncHandler from 'express-async-handler';
import { generateFANTOMWallet } from '../../../../controllers/crypto/wallet/fantomController';

const generFantomWallet = Router();

generFantomWallet.post('/', asyncHandler(generateFANTOMWallet));

export{generFantomWallet};
