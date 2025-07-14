// models/Singer.js
const mongoose = require('mongoose');

const singerSchema = new mongoose.Schema({
  singername: {
    type: String,
    required: true,
    trim: true
  },
  singerimg: {
    type: String,
    required: true,
    trim: true
  },
  songslist: [
    {
      songname: {
        type: String,
        required: true,
        trim: true
      },
      songthumbnail: {
        type: String,
        required: true,
        trim: true
      },
      language: {
        type: String,
        required: true,
        trim: true
      },
      songurl: {
        type: String,
        required: true,
        trim: true
      },
      songid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Song',
        required: true
      }
    }
  ]
},{
    collection:"singers",
    versionKey:false
});

module.exports = mongoose.model('singers', singerSchema);
