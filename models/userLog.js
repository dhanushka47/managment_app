const mongoose = require('mongoose');

const userLogSchema = new mongoose.Schema({
  action: { type: String, required: true },           // e.g., create, delete, update-role
  performedBy: { type: String, required: true },      // admin's username
  targetUser: { type: String, required: true },       // user being modified
  details: { type: Object },                          // extra data (e.g., new role)
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('UserLog', userLogSchema);



/*
const UserLog = require('../../models/userLog');

await new UserLog({
  action: 'create',
  performedBy: req.user.username,
  targetUser: username,
  details: { role }
}).save();
*/