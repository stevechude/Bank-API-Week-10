import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../model/userModel';

const isAuthenticated = async (req: any, res: any, next: NextFunction) => {
    const token = req.header('auth-token');
    if(!token) return res.status(401).send('Access Denied');

    const Secret = process.env.JWT_SECRET!;

    try {
        const decoded = jwt.verify(token, Secret) 

          req.user = decoded;
          next()
    } catch (error) {
        console.log(error)
    }
}

export {isAuthenticated}