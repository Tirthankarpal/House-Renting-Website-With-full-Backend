const express=require('express');
const storeRouter=express.Router();
const storeController = require('../controllers/storeController');
storeRouter.get("/",storeController.getIndex);
storeRouter.get("/homes",storeController.getHome);
storeRouter.get("/bookings",storeController.getBookings);
storeRouter.get("/favourites",storeController.getFavouriteList);
storeRouter.get("/homes/:id",storeController.getHomeDetails);
storeRouter.post("/favourites",storeController.postAddToFavourites);
storeRouter.post("/favourites/delete/:id",storeController.postDeleteFromFavourites);
storeRouter.post("/homes/:id/review", storeController.postReview);
storeRouter.post("/homes/:homeId/review/:reviewId/delete", storeController.postDeleteReview);
storeRouter.post("/store/bookings",storeController.postBook);
storeRouter.post("/bookings/delete", storeController.postDeleteBooking);
module.exports=storeRouter;

