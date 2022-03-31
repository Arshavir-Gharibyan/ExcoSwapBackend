import { getAllWalletsBalance } from '../../../controllers/crypto/wallet/walletControler';
import { Router } from 'express';
import asyncHandler from 'express-async-handler';
const getBalance = Router();

getBalance.get('/', asyncHandler(getAllWalletsBalance));

export default getBalance;
