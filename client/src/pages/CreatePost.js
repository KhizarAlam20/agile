import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { postsAPI } from '../utils/api';
import PostEditor from '../components/blog/PostEditor';
import Card, { CardHeader, CardBody } from '../components/ui/Card';
import Alert from '../components/ui/Alert';

const CreatePost = () => {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubmit = async (postData) => {
    try {
      setIsSubmitting(true);
      setError('');
      
      const response = await postsAPI.createPost(postData);
      
      toast.success('Post created successfully!');
      navigate(`/posts/${response.data.post._id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create post. Please try again.');
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="max-w-4xl mx-auto py-8">
      <Card>
        <CardHeader>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Create New Post
          </h1>
        </CardHeader>
        
        <CardBody>
          {error && (
            <Alert
              type="error"
              message={error}
              onClose={() => setError('')}
              className="mb-6"
            />
          )}
          
          <PostEditor
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
          />
        </CardBody>
      </Card>
    </div>
  );
};

export default CreatePost; 