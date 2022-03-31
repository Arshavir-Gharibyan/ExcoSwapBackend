import { getCeloBalanceDb } from '../../../controllers/crypto/getCeloBalanceDb';
import { Router } from 'express';
import asyncHandler from 'express-async-handler';
const getCeloBalance = Router();

getCeloBalance.get('/', asyncHandler(getCeloBalanceDb));

export default getCeloBalance;
