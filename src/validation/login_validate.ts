import joi from 'joi';
import { Request, Response, NextFunction } from 'express';
import StatusCode from 'http-status-codes';

const schema = joi.object().keys({
    email: joi.string().min(6).required(),
    password: joi.string().min(6).required()
})

const loginValidation = (req: Request, res: Response, next: NextFunction) => {
    schema.validateAsync(req.body, {abortEarly: false})
    .then(() => next())
    .catch((error) => res.status(StatusCode.BAD_REQUEST).end(error.message))
}

export {
    loginValidation
}