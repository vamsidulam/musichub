const mongoose = require('mongoose');

const playlistSchema = new mongoose.Schema({
  playlistname: {
    type: String,
    required: true
  },
  useremail: {
    type: String,
    required: true
  },
  songslist: [
    {
      songname: { type: String, default: null },
      songthumbnail: { type: String, default: null },
      language: { type: String, default: null },
      songurl: { type: String, default: null },
      songid: { type: mongoose.Schema.Types.ObjectId, default: null }
    }
  ]
}, {
  collection: "playlists",
  versionKey: false
});

module.exports = mongoose.model('playlists', playlistSchema);
