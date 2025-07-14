// models/Song.js
const mongoose = require('mongoose');

const songSchema = new mongoose.Schema({
  songname: {
    type: String,
    required: true,
    trim: true
  },
  songurl: {
    type: String,
    required: true
  },
  songthumbnail: {
    type: String,
    required: true
  },
  singername: {
    type: String,
    required: true,
    trim: true
  },
  language: {
    type: String,
    required: true
  },
  uploadedat: {
    type: Date,
    default: Date.now
  }
},{
    collection:"Song",
    versionKey:false
});

module.exports = mongoose.model('Song', songSchema);
