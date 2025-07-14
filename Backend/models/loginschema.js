// models/User.js
const mongoose = require('mongoose');

const logindetailsschema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  registeredat: {
    type: Date,
    default: Date.now
  },
  blocked: {
    type: Boolean,
    default: false
  }
},{
    collection:"logindetails",
    versionKey:false
});

module.exports = mongoose.model('logindetails', logindetailsschema);
