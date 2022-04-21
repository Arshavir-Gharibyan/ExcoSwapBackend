import { getEthBalance } from '../../../controllers/crypto/wallet/ethController';
import { Router } from 'express';
import asyncHandler from 'express-async-handler';
const getEthereumBalance = Router();

getEthereumBalance.get('/', asyncHandler(getEthBalance));

export default getEthereumBalance
