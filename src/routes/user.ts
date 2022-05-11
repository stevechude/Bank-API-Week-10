import express from 'express';
import {loginValidation} from '../validation/login_validate';
import {validRegister} from '../validation/register_validate';
import {login, register} from '../controller/userController';
import {isAuthenticated} from '../middleware/is-authenticated';

const router = express.Router();

router.post('/register', validRegister, register)

router.post('/login', loginValidation, isAuthenticated, login)


export default router;