const axios = require('axios');

const testLoginApi = async () => {
  try {
    console.log('Testing login API...');
    
    const response = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'admin@blogweb.com',
      password: 'admin123'
    });
    
    console.log('Login successful!');
    console.log('Status:', response.status);
    console.log('User:', response.data.user);
    console.log('Token:', response.data.token.substring(0, 20) + '...');
    
    return true;
  } catch (error) {
    console.error('Login failed!');
    
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('Status:', error.response.status);
      console.error('Response data:', error.response.data);
    } else if (error.request) {
      // The request was made but no response was received
      console.error('No response received. Is the server running?');
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Error:', error.message);
    }
    
    return false;
  }
};

// Execute the test
testLoginApi(); 