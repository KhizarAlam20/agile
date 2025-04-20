import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { postsAPI } from '../utils/api';
import PostEditor from '../components/blog/PostEditor';
import Card, { CardHeader, CardBody } from '../components/ui/Card';
import Alert from '../components/ui/Alert';
import Button from '../components/ui/Button';

const EditPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Fetch post data
  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const response = await postsAPI.getPost(id);
        setPost(response.data.post);
      } catch (err) {
        setError('Failed to load post. It may have been deleted or you may not have permission to edit it.');
        console.error('Error fetching post:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchPost();
  }, [id]);
  
  // Handle form submission
  const handleSubmit = async (postData) => {
    try {
      setIsSubmitting(true);
      setError('');
      
      await postsAPI.updatePost(id, postData);
      
      toast.success('Post updated successfully!');
      navigate(`/posts/${id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update post. Please try again.');
      setIsSubmitting(false);
    }
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }
  
  if (error || !post) {
    return (
      <div className="max-w-4xl mx-auto py-8">
        <Alert
          type="error"
          message={error || 'Post not found'}
          className="mb-4"
        />
        <Button
          onClick={() => navigate('/')}
          variant="primary"
        >
          Back to Home
        </Button>
      </div>
    );
  }
  
  return (
    <div className="max-w-4xl mx-auto py-8">
      <Card>
        <CardHeader>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Edit Post
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
            post={post}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
          />
        </CardBody>
      </Card>
    </div>
  );
};

export default EditPost; 