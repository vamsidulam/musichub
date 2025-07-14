const mongoose = require('mongoose');

const playpauseSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  songid: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  songname: {
    type: String,
    required: true,
  },
  clickedat: {
    type: Date,
    default: Date.now
  },
  playedtime: {
    type: Number,
    default: 0
  },
  updatedtime: {
    type: Date,
    default: Date.now
  }
},{
  collection:"playpausetracking",
  versionKey:false
});

module.exports = mongoose.model('playpausetracking', playpauseSchema);
