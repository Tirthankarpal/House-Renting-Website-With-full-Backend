const mongoose = require('mongoose');
const homeSchema = mongoose.Schema({
  houseName:{
    type: String,
    required: true
  },
  Price: {
    type: String,
    required: true
  },
  Location: {
    type: String,
    required: true
  },
  Rating: {
    type: String,
    required: true
  },
  PhotoUrl:String,
  Description:String
});
// homeSchema.pre('findOneAndDelete',async function(next) {
//   const homeId=this.getQuery()._id;
//   await Favourite.deleteMany({houseId:homeId});
//   next();
// });
module.exports = mongoose.model('Home', homeSchema);