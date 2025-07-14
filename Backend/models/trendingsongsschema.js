// models/Song.js
const mongoose = require('mongoose');

const trendingsongSchema = new mongoose.Schema({
  songname: {
    type: String,
    required: true,
    trim: true
  },
  songurl: {
    type: String,
    required: true,
    trim: true
  },
  songthumbnail: {
    type: String,
    required: true,
    trim: true
  },
  singername: {
    type: String,
    required: true,
    trim: true
  },
  language: {
    type: String,
    required: true,
    trim: true
  },
  uploadedat: {
    type: Date,
    default: Date.now
  }
},{
    collection:"Trendingsongs",
    versionKey:false
});

module.exports = mongoose.model('Trendingsongs', trendingsongSchema);
