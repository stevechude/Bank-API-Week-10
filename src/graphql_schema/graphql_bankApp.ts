import {
  GraphQLID,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLFloat,
  GraphQLString,
} from 'graphql';
import { v4 as uuidv4 } from 'uuid';
import Balances from '../model/balanceModel';
import Transactions from '../model/transactionModel';

//for everything about query balance..
const balanceType = new GraphQLObjectType({
  name: 'User',
  fields: {
    _id: {
      type: new GraphQLNonNull(GraphQLID),
    },
    balance: {
      type: new GraphQLNonNull(GraphQLFloat),
    },
    acc_number: {
      type: new GraphQLNonNull(GraphQLFloat),
    },
  },
});

//for everything about mutation balance..
const balanceInputType = new GraphQLObjectType({
  name: 'BalanceInput',
  fields: {
    balance: {
      type: new GraphQLNonNull(GraphQLFloat),
    },
    _id: {
      type: new GraphQLNonNull(GraphQLID),
    },
    acc_number: {
      type: new GraphQLNonNull(GraphQLFloat),
    },
  },
});

//for everything about query transaction..
const transactionType = new GraphQLObjectType({
  name: 'Transfer',
  fields: {
    senderAccount_number: {
      type: new GraphQLNonNull(GraphQLFloat),
    },
    receiverAccount_number: {
      type: new GraphQLNonNull(GraphQLFloat),
    },
    amount: {
      type: new GraphQLNonNull(GraphQLFloat),
    },
    transferDescription: {
      type: new GraphQLNonNull(GraphQLString),
    },
  },
});

//for everything about mutation transaction..
const transactionInputType = new GraphQLObjectType({
  name: 'TransactionInput',
  fields: {
    from: {
      type: new GraphQLNonNull(GraphQLFloat),
    },
    to: {
      type: new GraphQLNonNull(GraphQLFloat),
    },
    amount: {
      type: new GraphQLNonNull(GraphQLFloat),
    },
  },
});

const rootQuery = new GraphQLObjectType({
  name: 'Query',
  fields: {
    balance: {
      type: new GraphQLList(balanceType),
      resolve: async () => {
        try {
          return await Balances.find();
        } catch (error: any) {
          throw new Error(error.message);
        }
      },
    },
    oneBalance: {
      type: balanceType,
      args: {
        id: {
          type: new GraphQLNonNull(GraphQLID),
        },
      },
      resolve: async (_, args) => {
        try {
          return await Balances.findById(args.id);
        } catch (error: any) {
          throw new Error(error.message);
        }
      },
    },
    transaction: {
      type: new GraphQLList(transactionType),
      resolve: async () => {
        try {
          return await Transactions.find();
        } catch (error: any) {
          throw new Error(error.message);
        }
      },
    },
    oneTransaction: {
      type: transactionType,
      args: {
        reference: {
          type: new GraphQLNonNull(GraphQLString),
        },
      },
      resolve: async (_, args) => {
        try {
          return await Transactions.findOne(args.reference);
        } catch (error: any) {
          throw new Error(error.message);
        }
      },
    },
  },
});

const rootMutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    createBalance: {
      type: balanceInputType,
      args: {
        balance: { type: new GraphQLNonNull(GraphQLFloat) },
      },
      resolve: async (_, args) => {
        const balance = args.balance;
        const acc_number = generateAccountNumber();

        const newBal = new Balances({
          acc_number,
          balance,
        });

        await newBal.save();
        const userAccount = newBal._doc;

        return {
          msg: 'Account Added!',
          ...userAccount,
        };
        //return true;
      },
    },
    createTransfer: {
      type: transactionInputType,
      args: {
        to: {
          type: new GraphQLNonNull(GraphQLFloat),
        },
        from: {
          type: new GraphQLNonNull(GraphQLFloat),
        },
        amount: {
          type: new GraphQLNonNull(GraphQLFloat),
        },
      },
      resolve: async (_, args) => {
        const accountData = await Balances.find();

        const { from, to, amount } = args;
        // let collection = Transactions;

        //validating from, to, amount.
        const senderAccount = accountData.find(
          (details: { acc_number: any }) => details.acc_number === from,
        );
        console.log(senderAccount);
        

        const receiverAccount = accountData.find(
          (details: { acc_number: any }) => details.acc_number === to,
        );
        console.log(receiverAccount);
        

        const senderCanSend = (senderAccount?.balance || 0) >= amount;

        if (senderAccount && receiverAccount && senderCanSend) {
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
            createdAt: new Date().toISOString(),
          });

          await transaction.save();

          await senderAccount.save();
          await receiverAccount.save();

          return {
            msg: 'Transaction Successful.',
            ...transaction,
          };
        } else {
          return 'Transaction Failed.';
        }

        function transferDescription(amount: number, from: number) {
          return `Debit Transaction: N${amount} transfered from ${from}.`;
        }
      },
    },
  },
});

function generateAccountNumber() {
  return Math.floor(1000000000 + Math.random() * 9999999999);
}

export default new GraphQLSchema({
  query: rootQuery,
  mutation: rootMutation,
});
