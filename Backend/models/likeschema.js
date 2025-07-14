// models/LikedSong.js
const mongoose = require('mongoose');

const likedSongSchema = new mongoose.Schema({
  useremail: {
    type: String,
    required: true,
    lowercase: true,
    trim: true
  },
  songid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Song',
    required: true
  },
  songname: {
    type: String,
    required: true,
    trim: true
  },
  songimg: {
    type: String,
    required: true,
    trim: true
  },
  liked: {
    type: Boolean,
    default: false
  },
  likedat: {
    type: Date,
    default: Date.now
  }
},{
    collection:"likedetails",
    versionKey:false
});

module.exports = mongoose.model('likedetails', likedSongSchema);
