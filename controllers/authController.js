const User = require('../models/user');
const bcrypt = require('bcryptjs');
const { check, validationResult } = require('express-validator');

exports.postLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Incorrect password" });
    }
    req.session.isLoggedIn = true;
    req.session.user = { _id: user._id, email: user.email, firstName: user.firstName, lastName: user.lastName, userType: user.userType };
    await req.session.save();
    res.status(200).json({ message: "Logged in successfully", user: req.session.user });
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.postLogout = (req, res, next) => {
  req.session.destroy(() => {
    res.status(200).json({ message: "Logged out successfully" });
  });
};

exports.postSignup = [
  check('firstName').notEmpty().withMessage('First name is required').trim().isLength({ min: 3 }).matches(/^[a-zA-Z]+$/),
  check('lastName').matches(/^[a-zA-Z]*$/),
  check('email').isEmail().normalizeEmail(),
  check('password').isLength({ min: 6 }).matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,}$/),
  check('confirmPassword').trim().custom((value, { req }) => value === req.body.password),
  check('userType').notEmpty().isIn(['guest', 'host']),
  check('terms').custom(value => value === 'true' || value === true || value === 'on'),
  async (req, res, next) => {
    try {
      const { firstName, lastName, email, password, userType } = req.body;
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(422).json({ error: "Validation failed", details: errors.array() });
      }
      
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(409).json({ error: "Email already exists" });
      }

      const hashedPassword = await bcrypt.hash(password, 12);
      const user = new User({ firstName, lastName, email, password: hashedPassword, userType });
      await user.save();
      res.status(201).json({ message: "User created successfully" });
    } catch (err) {
      res.status(500).json({ error: "Internal server error" });
    }
  }
];

exports.getProfile = (req, res, next) => {
  if (!req.session.isLoggedIn) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  res.status(200).json({ user: req.session.user });
};

exports.checkAuth = (req, res, next) => {
  if (req.session.isLoggedIn && req.session.user) {
    res.status(200).json({ isLoggedIn: true, user: req.session.user });
  } else {
    res.status(401).json({ isLoggedIn: false });
  }
};
