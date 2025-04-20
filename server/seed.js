const mongoose = require('mongoose');
const User = require('./models/User');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Admin user credentials
const adminUser = {
  name: 'Admin User',
  email: 'admin@blogweb.com',
  password: 'admin123',
  role: 'admin',
  profilePicture: 'https://ui-avatars.com/api/?name=Admin+User&background=random',
  bio: 'Blog administrator'
};

// Connect to MongoDB
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/blog-web';

const createAdminUser = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');

    // Check if admin user already exists
    const existingAdmin = await User.findOne({ email: adminUser.email });
    
    if (existingAdmin) {
      console.log('Admin user already exists');
    } else {
      // Create new admin user
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(adminUser.password, salt);
      
      const newAdmin = new User({
        name: adminUser.name,
        email: adminUser.email,
        password: hashedPassword,
        role: adminUser.role,
        profilePicture: adminUser.profilePicture,
        bio: adminUser.bio
      });
      
      await newAdmin.save();
      console.log('Admin user created successfully');
    }
    
    console.log('Admin credentials:');
    console.log(`Email: ${adminUser.email}`);
    console.log(`Password: ${adminUser.password}`);
    
    // Disconnect from MongoDB
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
    
  } catch (error) {
    console.error('Error creating admin user:', error);
  }
};

// Run the function
createAdminUser(); 