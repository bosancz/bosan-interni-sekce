var mongoose = require("mongoose");

var memberSchema = mongoose.Schema({
  
  "nickname": String,
  "group": String,
  "role": String,
  "srcId": Number,
  
  "name": {
    "first": String,
    "last": String
  },
  
  "birthday": Date,
  
  "address": {
    "street": String,
    "streetNo": String,
    "city": String,
    "postalCode": String,
    "country": String
  },
  
  "contacts": {
    "mobile": String,
    "email": String,
    "mother": String,
    "father": String
  },

  "achievements": [{
    "id": String,
    "dateFrom": Date,
    "dateTill": Date
  }]
  
});

module.exports = mongoose.model("Member", memberSchema);