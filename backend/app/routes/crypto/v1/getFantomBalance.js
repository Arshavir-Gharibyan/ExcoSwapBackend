import { getFANTOMBalance } from '../../../controllers/crypto/wallet/fantomController';
import { Router } from 'express';
import asyncHandler from 'express-async-handler';
const getFantomBalance = Router();

getFantomBalance.get('/', asyncHandler(getFANTOMBalance));

export default getFantomBalance;
