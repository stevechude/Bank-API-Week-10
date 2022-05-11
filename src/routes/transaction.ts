import express from 'express';
import controller from '../controller/transactionController';
import {isAuthenticated} from '../middleware/is-authenticated';
const router = express.Router();




router.get('/', isAuthenticated, controller.getAllTransaction);

router.get('/:acc', isAuthenticated, controller.getTransaction);

router.post('/', controller.createTransaction);

export default router