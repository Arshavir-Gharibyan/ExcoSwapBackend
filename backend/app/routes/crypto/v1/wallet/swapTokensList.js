import { Router } from 'express';
import asyncHandler from 'express-async-handler';
import {getSwapTokensList} from "../../../../controllers/crypto/wallet/swapController";
const swapTokensList = Router();

swapTokensList.get('/', asyncHandler(getSwapTokensList));

export default swapTokensList;
