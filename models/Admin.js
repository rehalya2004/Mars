const mongoose = require('mongoose');

const AdminSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true // Ensure the username is unique
  },
  password: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('Admin', AdminSchema);
