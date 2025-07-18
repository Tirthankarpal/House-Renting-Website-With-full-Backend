const User = require('../models/user');
const bcrypt = require('bcryptjs');
const { check, validationResult } = require('express-validator');
exports.getLogin=(req,res,next)=>{
  res.render('auth/login',{pageTitle:"Login", currentPage:"login",isLoggedIn:false,oldInput: {}, errorMessage: null,user:{}});
}
exports.postLogin= async(req,res,next)=>{
  console.log("came to post login",req.body);
  const email=req.body.email;
  const password=req.body.password;
  const user= await User.findOne({email:email});
  if(!user){
    console.log("User not found");
    return res.status(422).render('auth/login', {
      pageTitle: "Login",
      currentPage: "login",
      isLoggedIn: false,      
      errorMessage: "User not found",
      oldInput: {email},
      user: {} 
    });
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    console.log("Incorrect password");
    return res.status(422).render('auth/login', {
      pageTitle: "Login",
      currentPage: "login",
      isLoggedIn: false,
      errorMessage: "Incorrect password",      
      oldInput: {email},
      user: {}
    });
  }
  req.session.isLoggedIn = true;
  req.session.user = user; // Store the user object in the session
  await req.session.save();
  console.log("User logged in successfully", user);
  // res.cookie('isLoggedIn',true);
  res.redirect('/');
}
exports.postLogout=(req,res,next)=>{
  console.log("came to post logout");
  req.session.destroy(()=>{
    console.log("session destroyed");
    res.redirect('/login');
  });
}
exports.getSignup=(req,res,next)=>{
  res.render('auth/signup',{pageTitle:"Signup", currentPage:"signup",isLoggedIn:false,oldInput: {}, errorMessage: null,user:{}});
}
exports.postSignup=[
  check('firstName').notEmpty().withMessage('First name is required').trim().isLength({ min: 3 }).withMessage('First name must be at least 3 characters long').matches(/^[a-zA-Z]+$/).withMessage('First name must contain only letters'),
  check('lastName').matches(/^[a-zA-Z]*$/).withMessage('Last name must contain only letters'),
  check('email').isEmail().withMessage('Please enter a valid email address').normalizeEmail(),
  check('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long').matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,}$/).withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),
  check('confirmPassword').trim().custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error('Passwords do not match');
    }
    return true;
  }),
  check('userType').notEmpty().withMessage('User type is required').isIn(['guest', 'host']).withMessage(`User type must be either "guest" or "host"`),
  check('terms').equals('on').withMessage('You must accept the terms and conditions'),
  (req,res,next)=>{
    const {firstName,lastName,email,password,userType}=req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log("Validation errors:", errors.array());
      return res.status(422).render('auth/signup', {
        pageTitle: "Signup",
        currentPage: "signup",
        isLoggedIn: false,
        errorMessage: errors.array().map(err => err.msg),
        oldInput: {
          firstName,
          lastName,
          email,
          password,
          userType
        },
        user: {}
      });
    }
    bcrypt.hash(password, 12)
      .then(hashedPassword => {
        const user = new User({
          firstName,
          lastName,
          email,
          password: hashedPassword,
          userType
        });
        return user.save();
      })
      .then(result => {
        console.log("User created successfully");
        res.redirect('/login');
      })
      .catch(err => {
        console.error("Error creating user:", err);
        res.status(422).render('auth/signup', {
          pageTitle: "Signup",
          currentPage: "signup",
          isLoggedIn: false,
          errorMessage: [err.message],
          oldInput: {
            firstName,
            lastName,
            email,
            password,
            userType
          },
          user: {}
        });
      });
}]
