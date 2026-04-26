const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://campusadmin:Campus2026@campus-service.7q1knsw.mongodb.net/campus-service');
const User = require('./models/User');
User.findOneAndUpdate(
  {email: 'admin@rgukt.in'},
  {role: 'admin'},
  {new: true}
).then(u => console.log('Admin set:', u?.email)).catch(console.error).finally(() => mongoose.disconnect());
