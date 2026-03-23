const express = require('express');
const authRouter = express.Router();
const authController = require('../controllers/authController');

authRouter.post('/login', authController.postLogin);
authRouter.post('/logout', authController.postLogout);
authRouter.post('/signup', authController.postSignup);
authRouter.get('/profile', authController.getProfile);

module.exports = authRouter;
