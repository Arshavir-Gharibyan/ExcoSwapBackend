import { getBitcoinBalanceDb } from '../../../controllers/crypto/getBitcoinBalanceDb';
import { Router } from 'express';
import asyncHandler from 'express-async-handler';
const getBitcoinBalance = Router();

getBitcoinBalance.get('/', asyncHandler(getBitcoinBalanceDb));

export default getBitcoinBalance;
