import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const transactionSchema = new Schema({
    reference: { type: String, required: true, unique: true },
    amount: { type: Number, required: true },
    senderAccount_number: { type: Number, maxlength: 10, required: true },
    receiverAccount_number: { type: Number, maxlength: 10, required: true },
    transferDescription: { type: String, required: true },
}, {
    timestamps: true,
});

const Transactions = mongoose.model('Transactions', transactionSchema);

export default Transactions;