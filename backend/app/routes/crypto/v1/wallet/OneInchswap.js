import { Router } from 'express';
import asyncHandler from 'express-async-handler';
import {swapTokensOneInch} from "../../../../controllers/crypto/wallet/swapController";
const OneInchswap = Router();

OneInchswap.post('/', asyncHandler(swapTokensOneInch));

export default OneInchswap;
