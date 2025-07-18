const Home=require('../models/homes');
const User=require('../models/user');
const Review=require('../models/review');
exports.getHome=(req,res,next)=>{
  Home.find().then((homes) => {
  res.render('store/home', { registeredHomes: homes || [], pageTitle: 'Wellcome to AirBnb', currentPage: 'home', isLoggedIn: req.isLoggedIn, user: req.session.user });
});
};
exports.getIndex=(req,res,next)=>{
  console.log("Session Value",req.session);
  Home.find().then((homes) => {
  console.log(homes);
  res.render('store/index', { registeredHomes: homes || [], pageTitle: 'Wellcome to AirBnb', currentPage: 'Index', isLoggedIn: req.isLoggedIn, user: req.session.user });
});
};
exports.getBookings=(req,res,next)=>{
  res.render('store/bookings', { pageTitle: 'my bookings', currentPage: 'bookings', isLoggedIn: req.isLoggedIn, user: req.session.user });
};
exports.getHomeDetails=(req,res,next)=>{
  const homeId = req.params.id;

  Home.findById(homeId)
    .populate({
      path: 'reviews',
      populate: { path: 'user', select: 'firstName userType' }
    })
    .then((home) => {
      if (!home) return res.redirect('/homes');

      res.render('store/home-detail', {
        home,
        pageTitle: 'Home Detail',
        currentPage: 'home-detail',
        isLoggedIn: req.isLoggedIn,
        user: req.session.user
      });
    })
    .catch(err => console.log(err));
};
exports.postAddToFavourites=async (req,res,next)=>{
  console.log("came to add to favourites",req.body);
  const homeId=req.body.id;
  const userId=req.session.user._id;
  const user=await User.findById(userId);
  if(!user.favourites.includes(homeId)){
    user.favourites.push(homeId);
    await user.save();
    console.log("home added to favourites",user.favourites);
  }
  res.redirect('/favourites');
};

exports.getFavouriteList = async (req, res, next) => {
  const userId=req.session.user._id;
  const user=await User.findById(userId).populate('favourites');
  res.render('store/favourite-list', { favHomes: user.favourites || [], pageTitle: 'Favourites', currentPage: 'favourites', isLoggedIn: req.isLoggedIn, user: req.session.user });
};
exports.postDeleteFromFavourites=async(req,res,next)=>{
  console.log("came to delete from favourites",req.params.id);
  const homeId=req.params.id;
  const userId=req.session.user._id;
  const user=await User.findById(userId);
  if(user.favourites.includes(homeId)){
    user.favourites=user.favourites.filter((favId)=>favId.toString()!==homeId.toString());
    await user.save();
    console.log("home removed from favourites",user.favourites);
  }
  res.redirect('/favourites');
};
exports.postReview = async (req, res, next) => {
  const user = req.session.user;
  const homeId = req.params.id;
  const { comment } = req.body;
  if (!user || user.userType !== 'guest') {
    return res.status(403).send('Only guests can write reviews.');
  }
  if (!comment || !comment.trim()) {
    return res.redirect(`/homes/${homeId}`);
  }
  const Review = require('../models/review');
  const review = await Review.create({
    comment: comment.trim(),
    home: homeId,
    user: user._id,
    username: user.firstName
  });
  await Home.findByIdAndUpdate(homeId, {
    $push: { reviews: review._id }
  });
  res.redirect(`/homes/${homeId}`);
};
exports.postDeleteReview = async (req, res, next) => {
  const user = req.session.user;
  const { homeId, reviewId } = req.params;
  if (!user || user.userType !== 'guest') {
    return res.status(403).send('Not allowed.');
  }
  const Review = require('../models/review');
  const review = await Review.findById(reviewId);
  if (!review) {
    return res.status(404).send('Review not found.');
  }
  if (review.user.toString() !== user._id.toString()) {
    return res.status(403).send('You can only delete your own reviews.');
  }
  await Home.findByIdAndUpdate(homeId, {
    $pull: { reviews: review._id }
  });
  await Review.findByIdAndDelete(reviewId);
  res.redirect(`/homes/${homeId}`);
};
