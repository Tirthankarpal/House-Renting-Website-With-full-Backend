require('dotenv').config();
const express = require('express');
const path = require('path');
const Razorpay = require('razorpay');
const rootDir = require('./utils/pathUtil');
const storeRouter = require('./routes/storeRouter');
const hostRouter = require('./routes/hostRouter');
const authRouter = require('./routes/authRouter');
const homeController = require('./controllers/hostController');
const errorController = require('./controllers/error');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);

const app = express();
const db_path = "mongodb+srv://tirthankarpal846:12345678910tprs@tirthankardb.971wmo3.mongodb.net/airbnb?retryWrites=true&w=majority&tls=true&appName=TirthankarDB";

const store = new MongoDBStore({
  uri: db_path,
  collection: 'sessions'
});

// Create Razorpay instance using env variables
const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_ID_KEY || 'rzp_test_Y2wy8t1wD1AFaA',
  key_secret: process.env.RAZORPAY_SECRET_KEY || 'zSqRMpIa2ljBBpkieFYGmfLa',
});

const cors = require('cors');
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.static(path.join(rootDir, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(session({
  secret: process.env.SESSION_SECRET || "secret",
  resave: false,
  saveUninitialized: true,
  store: store
}));

// Expose public Razorpay key to views
app.locals.razorpayKey = process.env.RAZORPAY_ID_KEY || 'rzp_test_Y2wy8t1wD1AFaA';

// Import and instantiate payment controller with DI
const User = require('./models/user');
const createPaymentController = require('./controllers/paymentController');
const createPaymentRouter = require('./routes/paymentRouter');

const paymentController = createPaymentController({
  razorpay: razorpayInstance,
  User: User,
  razorpaySecret: process.env.RAZORPAY_SECRET_KEY || 'zSqRMpIa2ljBBpkieFYGmfLa'
});

const paymentRouter = createPaymentRouter(paymentController);
app.use('/payment', paymentRouter);

app.use((req, res, next) => {
  console.log("cookie check middleware", req.get('Cookie'));
  req.isLoggedIn = req.session.isLoggedIn || false;
  next();
});

app.use(authRouter);
app.use(storeRouter);
app.use("/host", (req, res, next) => {
  if (req.isLoggedIn) {
    next();
  } else {
    res.redirect('/login');
  }
});
app.use("/host", hostRouter);
app.use(errorController.errorPage);

mongoose.connect(db_path).then(client => {
  console.log("Connected to database");
  const PORT = 3002;
  app.listen(PORT, () => {
    console.log(`Server is running on address http://localhost:${PORT}`);
  });
}).catch(err => {
  console.log("an error occured in mongoose", err);
});