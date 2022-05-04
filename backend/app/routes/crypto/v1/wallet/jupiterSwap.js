import { Router } from 'express';
import asyncHandler from 'express-async-handler';
import {swapTokensJupiter} from "../../../../controllers/crypto/wallet/swapController";
const jupiterSwap = Router();

jupiterSwap.post('/', asyncHandler(swapTokensJupiter));

export default jupiterSwap;
