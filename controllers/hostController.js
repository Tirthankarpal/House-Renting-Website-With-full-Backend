const Home = require('../models/homes');

exports.postAddHome = async (req, res, next) => {
  try {
    const { houseName, Price, Location, Rating, PhotoUrl, Description } = req.body;
    const home = new Home({ houseName, Price, Location, Rating, PhotoUrl, Description, review: [] });
    await home.save();
    res.status(201).json({ message: "Home added successfully", home });
  } catch (err) {
    res.status(500).json({ error: "Failed to add home", details: err });
  }
};

exports.getHostHomes = async (req, res, next) => {
  try {
    // Usually we would filter by host ID, but keeping existing logic here
    const homes = await Home.find();
    res.status(200).json({ registeredHomes: homes || [] });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch homes" });
  }
};

exports.getEditHome = async (req, res, next) => {
  try {
    const homeId = req.params.id;
    const home = await Home.findById(homeId);
    if (!home) {
      return res.status(404).json({ error: "Home not found" });
    }
    res.status(200).json({ home });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch home details" });
  }
};

exports.postEditHome = async (req, res, next) => {
  try {
    const { _id, houseName, Price, Location, Rating, PhotoUrl, Description } = req.body;
    const home = await Home.findById(_id || req.params.id);
    if (!home) {
      return res.status(404).json({ error: "Home not found" });
    }
    home.houseName = houseName;
    home.Price = Price;
    home.Location = Location;
    home.Rating = Rating;
    home.PhotoUrl = PhotoUrl;
    home.Description = Description;
    await home.save();
    res.status(200).json({ message: "Home updated successfully", home });
  } catch (err) {
    res.status(500).json({ error: "Failed to update home" });
  }
};

exports.postDeleteHome = async (req, res, next) => {
  try {
    const homeId = req.params.id;
    await Home.findByIdAndDelete(homeId);
    res.status(200).json({ message: "Home deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete home" });
  }
};