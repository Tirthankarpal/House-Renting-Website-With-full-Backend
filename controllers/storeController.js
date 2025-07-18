const Home=require('../models/homes');
const User=require('../models/user');
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
  const homeId=req.params.id;
  console.log("add home details page",homeId);
  Home.findById(homeId.toString()).then((home)=>{
    if(!home){
      return res.redirect('/homes');
    }
    else{
      console.log("home details found",home);
      res.render('store/home-detail', {home:home, pageTitle: 'Home Detail', currentPage: 'home-detail', isLoggedIn: req.isLoggedIn, user: req.session.user });
    }
  });
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