const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://campusadmin:Campus2026@campus-service.7q1knsw.mongodb.net/campus-service');
const User = require('./models/User');
User.find({role: 'staff'}).then(users => {
  users.forEach(u => console.log(u.name, u.email, u.role, u.department));
}).catch(console.error).finally(() => mongoose.disconnect());
