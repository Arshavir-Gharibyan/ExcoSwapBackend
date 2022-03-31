import { getSolanaBalance } from '../../../controllers/crypto/wallet/solanaController';
import { Router } from 'express';
import asyncHandler from 'express-async-handler';
const getSolanaBal = Router();

getSolanaBal.get('/', asyncHandler(getSolanaBalance));

export default getSolanaBal;
