import joi from 'joi';
import { Request, Response, NextFunction } from 'express';
import StatusCode from 'http-status-codes';

const transferSchema = joi.object({
  to: joi.number().required(),
  from: joi.number().required(),
  amount: joi.number().required(),
});

export const transferValidator = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  transferSchema
    .validateAsync(req.body, { abortEarly: false })
    .then(() => next())
    .catch((err) => {
      res.status(StatusCode.BAD_REQUEST).end(err.message);
    });
};
