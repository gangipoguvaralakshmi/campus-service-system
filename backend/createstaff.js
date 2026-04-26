const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
mongoose.connect('mongodb+srv://campusadmin:Campus2026@campus-service.7q1knsw.mongodb.net/campus-service');
const User = require('./models/User');
async function createStaff() {
  const hashedPassword = await bcrypt.hash('staff123', 10);
  const staffMembers = [
    {
      name: 'Ravi Kumar',
      email: 'plumber@campus.com',
      password: hashedPassword,
      role: 'staff',
      department: 'plumbing',
      contactNumber: '9111111111'
    },
    {
      name: 'Suresh Reddy',
      email: 'electrician@campus.com',
      password: hashedPassword,
      role: 'staff',
      department: 'electrical',
      contactNumber: '9222222222'
    },
    {
      name: 'Mahesh Babu',
      email: 'maintenance@campus.com',
      password: hashedPassword,
      role: 'staff',
      department: 'maintenance',
      contactNumber: '9333333333'
    },
    {
      name: 'Ramesh Naidu',
      email: 'hostel@campus.com',
      password: hashedPassword,
      role: 'staff',
      department: 'hostel',
      contactNumber: '9444444444'
    },
    {
      name: 'Venkat Rao',
      email: 'canteen@campus.com',
      password: hashedPassword,
      role: 'staff',
      department: 'canteen',
      contactNumber: '9555555555'
    }
  ];
  for (const staff of staffMembers) {
    const created = await User.create(staff);
    console.log('Staff created:', created.email, created.department);
  }
  mongoose.disconnect();
}
createStaff().catch(console.error);
