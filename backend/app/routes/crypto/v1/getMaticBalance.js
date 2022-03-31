import { getMaticBalanceDb } from '../../../controllers/crypto/getMaticBalanceDb';
import { Router } from 'express';
import asyncHandler from 'express-async-handler';
const getMaticBalance = Router();

getMaticBalance.get('/', asyncHandler(getMaticBalanceDb));

export default getMaticBalance;
