const mongoose = require('mongoose');
const User = require('./models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
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

// Generate JWT Token (same as in authController)
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'your-jwt-secret', {
    expiresIn: '30d',
  });
};

const testApiLogin = async () => {
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
    
    // If password is invalid, let's try to fix it again
    if (!isPasswordValid) {
      console.log('Attempting to reset admin password again...');
      
      // Update the admin user directly in the database
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(adminCredentials.password, salt);
      
      // Update using findByIdAndUpdate to bypass any middleware
      await User.findByIdAndUpdate(
        admin._id,
        { password: hashedPassword },
        { new: true }
      );
      
      console.log('Admin password has been reset directly in the database!');
    } else {
      // Simulate the login API response
      const token = generateToken(admin._id);
      
      console.log('Login would be successful with this response:');
      console.log({
        success: true,
        user: {
          _id: admin._id,
          name: admin.name,
          email: admin.email,
          role: admin.role
        },
        token
      });
      
      console.log('\nFor debugging the client:');
      console.log('1. Make sure the client is sending the request to: http://localhost:5000/api/auth/login');
      console.log('2. Make sure the request payload is:');
      console.log(JSON.stringify(adminCredentials, null, 2));
      console.log('3. Check browser console for any errors');
      console.log('4. Verify that the proxy in client/package.json is set to: "http://localhost:5000"');
    }
    
    // Disconnect from MongoDB
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
    
  } catch (error) {
    console.error('Error testing API login:', error);
  }
};

// Run the function
testApiLogin(); 