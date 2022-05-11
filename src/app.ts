import createError from 'http-errors';
import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import { graphqlHTTP } from 'express-graphql';
import balanceRoute from './routes/balance';
import transactionRoute from './routes/transaction';
import userRoute from './routes/user';
import schema from './graphql_schema/graphql_bankApp';
// import schema2 from './graphql_schema/transaction_graphql';

const mongoose = require('mongoose');
require('dotenv').config();


const app = express();

// view engine setup
app.set('views', path.join(__dirname, '..', 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '..', 'public')));

mongoose.connect("mongodb+srv://stevechude:houseofgrace@banking-app.jks2v.mongodb.net/banking-app?retryWrites=true&w=majority", { useNewUrlParser: true, useUnifiedTopology: true });   //
const connection = mongoose.connection;
connection.once('open', () => {
  console.log('MongoDB databasenconnection established successfully!');
} )

// Route Middlewares..
app.use('/balance', balanceRoute)
app.use('/transaction', transactionRoute)
app.use('/user', userRoute)

//Graphql 
app.use('/graphql', graphqlHTTP({
  schema,
  pretty: true,
  graphiql: true,
}))

// app.use('/graphql/transaction', graphqlHTTP({
//   schema: schema2,
//   pretty: true,
//   graphiql: true,
// }))

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (
  err: createError.HttpError,
  req: express.Request,
  res: express.Response,
  _next: express.NextFunction
) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

export default app;
