import { Router } from 'express';
import asyncHandler from 'express-async-handler';
import {swapTokensSell} from "../../../../controllers/crypto/wallet/swapController";
const sellToken = Router();

sellToken.post('/', asyncHandler(swapTokensSell));

export default sellToken;
