import { Router } from 'express';
import asyncHandler from 'express-async-handler';
import {getTokensMetaSolana} from "../../../../controllers/crypto/wallet/swapController";
const solanaTokenMetaByAddress = Router();

solanaTokenMetaByAddress.get('/:address', asyncHandler(getTokensMetaSolana));

export default solanaTokenMetaByAddress;