import { getBinanceBalance } from '../../../controllers/crypto/wallet/binanceController';
import { Router } from 'express';
import asyncHandler from 'express-async-handler';
const getBinanceBal = Router();

getBinanceBal.get('/', asyncHandler(getBinanceBalance));

export default getBinanceBal;
