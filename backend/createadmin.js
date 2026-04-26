const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
mongoose.connect('mongodb+srv://campusadmin:Campus2026@campus-service.7q1knsw.mongodb.net/campus-service');
const User = require('./models/User');
async function createAdmin() {
  const hashedPassword = await bcrypt.hash('Admin@2026', 10);
  const admin = await User.create({
    name: 'Admin',
    email: 'admin@campus.com',
    password: hashedPassword,
    role: 'admin',
    contactNumber: '9999999999'
  });
  console.log('Admin created:', admin.email, admin.role);
  mongoose.disconnect();
}
createAdmin().catch(console.error);
