const Home = require('../models/homes');
const User = require('../models/user');
const Review = require('../models/review');

exports.getHome = async (req, res, next) => {
  try {
    const homes = await Home.find();
    res.status(200).json({ registeredHomes: homes || [] });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch homes" });
  }
};

exports.getIndex = async (req, res, next) => {
  try {
    const homes = await Home.find();
    res.status(200).json({ registeredHomes: homes || [] });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch homes" });
  }
};

exports.getBookings = async (req, res, next) => {
  try {
    if (!req.session.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const user = await User.findById(req.session.user._id).populate('bookings');
    res.status(200).json({ bookings: user.bookings || [] });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch bookings" });
  }
};

exports.getHomeDetails = async (req, res, next) => {
  try {
    const homeId = req.params.id;
    const home = await Home.findById(homeId).populate({
      path: 'reviews',
      populate: { path: 'user', select: 'firstName userType' }
    });
    if (!home) {
      return res.status(404).json({ error: "Home not found" });
    }
    res.status(200).json({ 
      home,
      razorpayKey: process.env.RAZORPAY_ID_KEY || 'rzp_test_Y2wy8t1wD1AFaA'
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch home details" });
  }
};

exports.postAddToFavourites = async (req, res, next) => {
  try {
    const homeId = req.body.id;
    const userId = req.session.user?._id;
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const user = await User.findById(userId);
    if (!user.favourites.includes(homeId)) {
      user.favourites.push(homeId);
      await user.save();
    }
    res.status(200).json({ message: "Added to favourites", favourites: user.favourites });
  } catch (err) {
    res.status(500).json({ error: "Failed to add to favourites" });
  }
};

exports.getFavouriteList = async (req, res, next) => {
  try {
    const userId = req.session.user?._id;
    if (!userId) return res.status(401).json({ error: "Unauthorized" });
    const user = await User.findById(userId).populate('favourites');
    res.status(200).json({ favHomes: user.favourites || [] });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch favourites" });
  }
};

exports.postDeleteFromFavourites = async (req, res, next) => {
  try {
    const homeId = req.params.id;
    const userId = req.session.user?._id;
    if (!userId) return res.status(401).json({ error: "Unauthorized" });
    const user = await User.findById(userId);
    if (user.favourites.includes(homeId)) {
      user.favourites = user.favourites.filter((favId) => favId.toString() !== homeId.toString());
      await user.save();
    }
    res.status(200).json({ message: "Removed from favourites" });
  } catch (err) {
    res.status(500).json({ error: "Failed to remove from favourites" });
  }
};

exports.postReview = async (req, res, next) => {
  try {
    const user = req.session.user;
    const homeId = req.params.id;
    const { comment } = req.body;
    
    if (!user || user.userType !== 'guest') {
      return res.status(403).json({ error: "Only guests can write reviews." });
    }
    if (!comment || !comment.trim()) {
      return res.status(400).json({ error: "Comment cannot be empty." });
    }

    const review = await Review.create({
      comment: comment.trim(),
      home: homeId,
      user: user._id,
      username: user.firstName
    });
    
    await Home.findByIdAndUpdate(homeId, { $push: { reviews: review._id } });
    res.status(201).json({ message: "Review added", review });
  } catch (err) {
    res.status(500).json({ error: "Failed to add review" });
  }
};

exports.postDeleteReview = async (req, res, next) => {
  try {
    const user = req.session.user;
    const { homeId, reviewId } = req.params;
    
    if (!user || user.userType !== 'guest') {
      return res.status(403).json({ error: "Not allowed." });
    }

    const review = await Review.findById(reviewId);
    if (!review) return res.status(404).json({ error: "Review not found." });
    
    if (review.user.toString() !== user._id.toString()) {
      return res.status(403).json({ error: "You can only delete your own reviews." });
    }

    await Home.findByIdAndUpdate(homeId, { $pull: { reviews: review._id } });
    await Review.findByIdAndDelete(reviewId);
    res.status(200).json({ message: "Review deleted" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete review" });
  }
};

exports.postBook = async (req, res, next) => {
  try {
    const homeId = req.body.homeId;
    const userId = req.session.user?._id || req.body.userId;
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const user = await User.findById(userId);
    if (!user.bookings.includes(homeId)) {
      user.bookings.push(homeId);
      await user.save();
    }
    res.status(200).json({ message: "Booked successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to book home" });
  }
};

exports.postDeleteBooking = async (req, res, next) => {
  try {
    const homeId = req.body.homeId || req.params.id;
    const userId = req.session.user?._id;
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const user = await User.findById(userId);
    user.bookings = user.bookings.filter(b => b.toString() !== homeId.toString());
    await user.save();
    res.status(200).json({ message: "Booking cancelled" });
  } catch (err) {
    res.status(500).json({ error: "Failed to cancel booking" });
  }
};