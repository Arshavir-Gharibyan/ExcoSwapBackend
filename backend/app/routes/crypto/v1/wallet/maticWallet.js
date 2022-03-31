import { Router } from 'express';
import asyncHandler from 'express-async-handler';
import { generateMATICWallet } from '../../../../controllers/crypto/wallet/maticContoller';

const generMaticWallet = Router();

generMaticWallet.post('/', asyncHandler(generateMATICWallet));

export{generMaticWallet};
