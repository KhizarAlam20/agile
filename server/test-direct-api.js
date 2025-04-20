const axios = require('axios');

// Admin credentials to test
const adminCredentials = {
  email: 'admin@blogweb.com',
  password: 'admin123'
};

// API endpoint
const API_URL = 'http://localhost:5000/api/auth/login';

const testDirectApi = async () => {
  try {
    console.log('Sending login request to:', API_URL);
    console.log('With credentials:', adminCredentials);
    
    const response = await axios.post(API_URL, adminCredentials);
    
    console.log('Login successful!');
    console.log('Response status:', response.status);
    console.log('Response data:', response.data);
    
    console.log('\nIf this works but the client login doesn\'t:');
    console.log('1. Make sure your server is running on port 5000');
    console.log('2. Make sure your client is using the correct proxy');
    console.log('3. Check for any CORS issues in the browser console');
    console.log('4. Try clearing your browser cache and cookies');
    
  } catch (error) {
    console.error('Login failed!');
    console.error('Error status:', error.response?.status);
    console.error('Error message:', error.response?.data?.message || error.message);
    
    console.log('\nPossible issues:');
    console.log('1. Server not running on port 5000');
    console.log('2. API endpoint incorrect');
    console.log('3. Credentials still not working');
  }
};

// Run the function
testDirectApi(); 