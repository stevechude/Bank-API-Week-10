const mongoose = require('mongoose');

const Schema = mongoose.Schema;


const balanceSchema = new Schema({
   balance: { type: Number, required: true },
   acc_number: { type: Number, required: true }
}, {
    timestamps: true,
});

const Balances = mongoose.model('Balances', balanceSchema);

export default Balances;