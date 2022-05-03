import { Router } from 'express';
import asyncHandler from 'express-async-handler';
import {getSwapTokensListSolana} from "../../../../controllers/crypto/wallet/swapController";
const swapTokensListSolana = Router();

swapTokensListSolana.get('/', asyncHandler(getSwapTokensListSolana));

export default swapTokensListSolana;