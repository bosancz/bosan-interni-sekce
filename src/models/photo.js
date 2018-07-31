var mongoose = require("mongoose");

var path = require("path");
var config= require("../../config");

var Album = require("./album");

var photoSchema = mongoose.Schema({
  title: String,
  
  name: String,
  
  album: { type: String, ref: 'Album', required: true },

  width: Number,
  height: Number,

  date:Date,

  sizes: {
    original: { width:Number, height:Number, file:String },
    big: { width:Number, height:Number, file:String },
    small: { width:Number, height:Number, file:String },
  },
  
  bg: String

}, { toJSON: { virtuals: true } });

function getUrl(photo,size,dir){
  return path.join(dir,String(photo.album),photo.sizes[size].file);
}
photoSchema.virtual("sizes.original.url").get(function(){return getUrl(this,"original",config.photos.storageUrl);});
photoSchema.virtual("sizes.big.url").get(function(){return getUrl(this,"big",config.photos.thumbsUrl);});
photoSchema.virtual("sizes.small.url").get(function(){return getUrl(this,"small",config.photos.thumbsUrl);});

module.exports = mongoose.model("Photo", photoSchema);