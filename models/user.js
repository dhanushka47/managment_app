const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  fname: { type: String, required: true },
  lname: { type: String, required: true },
  birthday: { type: Date, required: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  role: { type: String, required: true },
  joinedDate: { type: Date, required: true },
  endDate: { type: Date },
  university: { type: String },
  department: { type: String },
  nic: { type: String, required: true }
});

module.exports = mongoose.model('User', userSchema);
