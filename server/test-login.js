const mongoose = require('mongoose');
const User = require('./models/User');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Admin credentials to test
const adminCredentials = {
  email: 'admin@blogweb.com',
  password: 'admin123'
};

// Connect to MongoDB
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/blog-web';

const testAdminLogin = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');

    // Find the admin user
    const admin = await User.findOne({ email: adminCredentials.email }).select('+password');
    
    if (!admin) {
      console.log('Admin user not found!');
      return;
    }
    
    console.log('Admin user found:');
    console.log({
      id: admin._id,
      name: admin.name,
      email: admin.email,
      role: admin.role,
      passwordLength: admin.password ? admin.password.length : 0
    });
    
    // Test password comparison
    const isPasswordValid = await admin.comparePassword(adminCredentials.password);
    console.log(`Password comparison result: ${isPasswordValid ? 'VALID' : 'INVALID'}`);
    
    // If password is invalid, let's try to fix it
    if (!isPasswordValid) {
      console.log('Attempting to reset admin password...');
      
      // Hash the password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(adminCredentials.password, salt);
      
      // Update the admin user with the new password
      admin.password = hashedPassword;
      await admin.save();
      
      console.log('Admin password has been reset!');
      console.log('Try logging in again with:');
      console.log(`Email: ${adminCredentials.email}`);
      console.log(`Password: ${adminCredentials.password}`);
    }
    
    // Disconnect from MongoDB
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
    
  } catch (error) {
    console.error('Error testing admin login:', error);
  }
};

// Run the function
testAdminLogin(); 