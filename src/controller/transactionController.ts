import { Request, Response } from 'express';
import Transactions from '../model/transactionModel';
import balanceModel from '../model/balanceModel';
import { v4 as uuidv4 } from 'uuid';
const asyncHandler = require('express-async-handler');


const getAllTransaction = asyncHandler(async (req: Request, res: Response) => {
    const transactionResult = await Transactions.find();

    let page = Number(req.query.page);
    let limit = Number(req.query.limit);

    if(!page && !limit) {
        page = 1;
        limit = 10;
    }

    //when pagination queries are set..
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    const finalResult = transactionResult.slice(startIndex, endIndex);
    
    function previous() {
        if(startIndex > 0) return page - 1;
    }

    function next() {
        if(endIndex < transactionResult.length) return page + 1;
    }

    res.status(200).json({
        previous: previous(),
        next: next(),
        data: finalResult
    });
})

const getTransaction = asyncHandler(async (req: Request, res: Response) => {
    const singleTransaction = await Transactions.findOne( { reference: req.params.acc } );

         if(!singleTransaction) {
             res.status(404).json({ message: 'Transaction not found!!' })
         } else {
            res.status(200).json(singleTransaction);
         }
})

const createTransaction = asyncHandler(async (req: Request, res: Response) => {
    const accountData = await balanceModel.find();

    const { from, to, amount } = req.body;
    // let collection = Transactions;

    //validating from, to, amount.
    const senderAccount = accountData.find((details: { acc_number: any; }) => details.acc_number === from);
    console.log(senderAccount)
    const receiverAccount = accountData.find((details: { acc_number: any; }) => details.acc_number === to);
    console.log(receiverAccount)
    const senderCanSend = (senderAccount?.balance || 0) >= amount;

    if(senderAccount && receiverAccount && senderCanSend) {
        //deduct money from sender..
        senderAccount.balance = Number(senderAccount.balance) - amount;
        //credit money to receiver..
        receiverAccount.balance = Number(receiverAccount.balance) + amount;

         //create the transaction..
         const transaction = new Transactions({
            reference: uuidv4(),
            senderAccount_number: from,
            amount,
            receiverAccount_number: to,
            transferDescription: transferDescription(amount, from),
            createdAt: new Date().toISOString()
        })

        await transaction.save()

        senderAccount.save()
        receiverAccount.save()
        
        res.status(200).json("Transaction Successful.");
    } else {
        res.status(404).json({
            status: 'fail',
            message: 'Please make sure the receiver\'s account and sendr\'s account exist and the amount is not above the sender\'s balance.' 
        });
    }

    function transferDescription (amount: number, from: number) {

     return `Debit Transaction: N${amount} transfered from ${from}.`
     
    }
})

export = {
    getAllTransaction,
    getTransaction,
    createTransaction
}