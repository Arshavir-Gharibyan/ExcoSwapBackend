import { Router } from 'express';
import asyncHandler from 'express-async-handler';
import {swapForTokens} from "../../../../controllers/crypto/wallet/swapController";
const swapToken = Router();

swapToken.post('/', asyncHandler(swapForTokens));

export default swapToken;
