import express from 'express';
import {isAuthenticated} from '../middleware/is-authenticated';
import {getAllBalance, getBalance, createAccBalance} from '../controller/balanceController';
import { accountValidator } from '../validation/balance_validation';

const router = express.Router();


router.get('/', isAuthenticated, getAllBalance);

router.get('/:acc', isAuthenticated, getBalance);

router.post('/', accountValidator, createAccBalance);

//router.post('/login', controller.creatUserToken);

export default router;