const express=require('express');
const path=require('path');
const rootDir=require('./utils/pathUtil');
const storeRouter=require('./routes/storeRouter');
const hostRouter=require('./routes/hostRouter');
const authRouter=require('./routes/authRouter');
const homeController = require('./controllers/hostController');
const errorController = require('./controllers/error');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const app=express();
const db_path="mongodb+srv://tirthankarpal846:12345678910tprs@tirthankardb.971wmo3.mongodb.net/airbnb?retryWrites=true&w=majority&tls=true&appName=TirthankarDB";
const store = new MongoDBStore({
  uri: db_path,
  collection: 'sessions'
});
app.set('view engine','ejs');
app.set('views','views');
app.use(express.static(path.join(rootDir,'public')));
app.use(express.urlencoded());
app.use(session({
  secret:"secret",
  resave:false,
  saveUninitialized:true,
  store: store
}));
app.use((req,res,next)=>{
  console.log("cookie check middleware",req.get('Cookie'));
  req.isLoggedIn = req.session.isLoggedIn || false;
  next();
});
app.use(authRouter);
app.use(storeRouter);
app.use("/host",(req,res,next)=>{
  if(req.isLoggedIn){
    next();
  }
  else res.redirect('/login');
});
app.use("/host",hostRouter);
app.use(errorController.errorPage);
mongoose.connect(db_path).then(client=>{
  console.log("Connected to database");
  const PORT=3002;
  app.listen(PORT,()=>{
    console.log(`Server is running on address http://localhost:${PORT}`);
  });
}).catch(err=>{
  console.log("an error occured in mongoose",err);
});