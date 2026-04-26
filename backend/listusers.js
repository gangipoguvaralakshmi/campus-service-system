const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://campusadmin:Campus2026@campus-service.7q1knsw.mongodb.net/campus-service');
const User = require('./models/User');
User.find({}).then(users => {
  users.forEach(u => console.log(u.email, u.role));
}).catch(console.error).finally(() => mongoose.disconnect());
