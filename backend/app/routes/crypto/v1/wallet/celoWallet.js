import { Router } from 'express';
import asyncHandler from 'express-async-handler';
import { generateCELOWallet } from '../../../../controllers/crypto/wallet/celoController';

const generCELOWallet = Router();

generCELOWallet.post('/', asyncHandler(generateCELOWallet));

export{generCELOWallet};
