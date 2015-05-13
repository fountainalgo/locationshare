// grab the mongoose module
var mongoose = require('mongoose');

// define our nerd model
// module.exports allows us to pass this to other files when it is called

var LocationSchema = new mongoose.Schema({
  userId: { type: String},
  lat: String,
  lon: String,
  address:String,
  created_at: { type: Date, required: true, default: Date.now }
});
module.exports = mongoose.model('Locations', LocationSchema);

