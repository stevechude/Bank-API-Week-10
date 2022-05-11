// import jwt from 'jsonwebtoken';
// import { Request, Response, NextFunction } from 'express';
// import User from '../model/userModel';

// export default async(req: Request, res: Response, next: NextFunction) => {
//     const token = req.header('auth-token');

//     if(!token) return res.status(401).json({ message: "Access Denied." });

//     try {
//         const Secret: any = process.env.JWT_SECRET;
//         const authorized = jwt.verify(token, Secret);
//         req.user = await User.findOne(req.body.email)
//     } catch (error) {
        
//     }
// }