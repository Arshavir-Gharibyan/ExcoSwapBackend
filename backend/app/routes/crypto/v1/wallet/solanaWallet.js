import { Router } from 'express';
import asyncHandler from 'express-async-handler';
import { generateSOLANAWallet } from '../../../../controllers/crypto/wallet/solanaController';

const generSolanaWallet = Router();

generSolanaWallet.post('/', asyncHandler(generateSOLANAWallet));

export{generSolanaWallet};
