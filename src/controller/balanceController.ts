import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import Balances from '../model/balanceModel';
const asyncHandler = require('express-async-handler');

const getAllBalance = asyncHandler(async (req: Request, res: Response) => {
    const balanceResult = await Balances.find()
    //Pagination for get all balance
    let page = Number(req.query.page);
    let limit = Number(req.query.limit);

    if(!page && !limit) {
        page = 1;
        limit = 10;
    }

    //when pagination queries are set..
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    const finalResult = balanceResult.slice(startIndex, endIndex);

    function previous() {
        if(startIndex > 0) return page - 1;
    }

    function next() {
        if(endIndex < balanceResult.length) return page + 1;
    }

    res.status(200).json({
        previous: previous(),
        next: next(),
        data: finalResult
    });
})


const getBalance = asyncHandler(async (req: Request,  res: Response) => {
    const singleBalance = await Balances.findById(req.params.acc);

    res.status(200).json(singleBalance);
})

const createAccBalance = asyncHandler(async (req: Request, res: Response) => {
    const balance = req.body.balance;
    const acc_number = generateAccountNumber()

    const newBal = new Balances({
        acc_number,
        balance,
       
    })

    await newBal.save();
    const userAccount = newBal._doc 
    
    res.status(201).json({
        msg:'Account Added!',
        ...userAccount,
    });

});

function generateAccountNumber() {
    return Math.floor(1000000000 + Math.random() * 9999999999);
}

export {
    getAllBalance,
    getBalance,
    createAccBalance

}