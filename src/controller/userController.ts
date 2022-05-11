import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User from '../model/userModel';

const register = async(req: Request, res: Response) => {
    //check if the user is already in the database.
    const emailExist = await User.findOne({email: req.body.email});
    if(emailExist) return res.status(400).send('Email already exist.')


    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
    });

    try {
        const saveUser = await user.save();
        res.status(200).json({
            message: "Registration Complete!",
            token: generateToken(user.id)
        })
    } catch (err:any) {
        res.status(400).json({
            error: err.message
        })
    }

}

const login = async(req: Request, res: Response) => {
    //check if the email already exist on the database.
    const user: any = await User.findOne({email: req.body.email});
    if(!user) return res.status(400).json({ message: "Email is not found!"})

    res.header('auth-token').json({user});
}

const generateToken = (id: string) => {
    const Secret: any = process.env.JWT_SECRET
    return jwt.sign({id}, Secret);
}


export {
    register,
    login
}