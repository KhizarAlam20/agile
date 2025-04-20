import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import { postsAPI } from '../utils/api';
import CommentSection from '../components/blog/CommentSection';
import Button from '../components/ui/Button';
import Alert from '../components/ui/Alert';
import { formatDate } from '../utils/helpers';
import { HeartIcon, ChatBubbleLeftIcon, CalendarIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';

const PostDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLiked, setIsLiked] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  
  // Fetch post details
  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const response = await postsAPI.getPost(id);
        setPost(response.data.post);
        
        // Check if user has liked the post
        if (isAuthenticated && response.data.post.likedBy) {
          setIsLiked(response.data.post.likedBy.includes(user._id));
        }
      } catch (err) {
        setError('Failed to load post. It may have been deleted or you may not have permission to view it.');
        console.error('Error fetching post:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchPost();
  }, [id, isAuthenticated, user]);
  
  // Handle like post
  const handleLikePost = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    try {
      await postsAPI.likePost(id);
      
      // Update post state
      setPost(prevPost => ({
        ...prevPost,
        likes: isLiked ? prevPost.likes - 1 : prevPost.likes + 1,
        likedBy: isLiked
          ? prevPost.likedBy.filter(userId => userId !== user._id)
          : [...prevPost.likedBy, user._id],
      }));
      
      setIsLiked(!isLiked);
    } catch (err) {
      toast.error('Failed to like post. Please try again.');
      console.error('Error liking post:', err);
    }
  };
  
  // Handle delete post
  const handleDeletePost = async () => {
    try {
      await postsAPI.deletePost(id);
      toast.success('Post deleted successfully');
      navigate('/');
    } catch (err) {
      toast.error('Failed to delete post. Please try again.');
      console.error('Error deleting post:', err);
    }
  };
  
  // Handle add comment
  const handleAddComment = async (postId, text) => {
    try {
      const response = await postsAPI.addComment(postId, text);
      setPost(prevPost => ({
        ...prevPost,
        comments: response.data.comments,
      }));
      toast.success('Comment added successfully');
    } catch (err) {
      toast.error('Failed to add comment. Please try again.');
      console.error('Error adding comment:', err);
      throw err;
    }
  };
  
  // Handle delete comment
  const handleDeleteComment = async (postId, commentId) => {
    try {
      const response = await postsAPI.deleteComment(postId, commentId);
      setPost(prevPost => ({
        ...prevPost,
        comments: response.data.comments,
      }));
      toast.success('Comment deleted successfully');
    } catch (err) {
      toast.error('Failed to delete comment. Please try again.');
      console.error('Error deleting comment:', err);
      throw err;
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
      <div className="max-w-4xl mx-auto py-8 px-4">
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
  
  const isAuthor = isAuthenticated && user._id === post.author._id;
  const isAdmin = isAuthenticated && user.role === 'admin';
  const canEdit = isAuthor || isAdmin;
  
  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      {/* Post Header */}
      <div className="mb-8">
        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {post.tags.map((tag, index) => (
              <Link
                key={index}
                to={`/?tag=${tag}`}
                className="inline-block px-3 py-1 text-sm font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600"
              >
                {tag}
              </Link>
            ))}
          </div>
        )}
        
        {/* Title */}
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
          {post.title}
        </h1>
        
        {/* Author and Date */}
        <div className="flex items-center text-gray-600 dark:text-gray-400 mb-6">
          <div className="flex items-center">
            {post.author?.profilePicture ? (
              <img
                src={post.author.profilePicture}
                alt={post.author.name}
                className="w-10 h-10 rounded-full mr-3"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 mr-3 flex items-center justify-center">
                <span className="text-gray-500 dark:text-gray-300 font-medium">
                  {post.author?.name?.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
            <span className="font-medium">{post.author?.name}</span>
          </div>
          <span className="mx-2">•</span>
          <div className="flex items-center">
            <CalendarIcon className="w-5 h-5 mr-1" />
            <span>{formatDate(post.createdAt)}</span>
          </div>
          
          {/* Edit/Delete buttons for author or admin */}
          {canEdit && (
            <div className="ml-auto flex space-x-2">
              <Link
                to={`/edit-post/${post._id}`}
                className="flex items-center text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400"
              >
                <PencilIcon className="w-5 h-5 mr-1" />
                <span>Edit</span>
              </Link>
              <button
                onClick={() => setConfirmDelete(true)}
                className="flex items-center text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400"
              >
                <TrashIcon className="w-5 h-5 mr-1" />
                <span>Delete</span>
              </button>
            </div>
          )}
        </div>
        
        {/* Delete Confirmation */}
        {confirmDelete && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-md">
            <p className="text-red-800 dark:text-red-300 mb-4">
              Are you sure you want to delete this post? This action cannot be undone.
            </p>
            <div className="flex space-x-3">
              <Button
                onClick={handleDeletePost}
                variant="danger"
              >
                Yes, Delete
              </Button>
              <Button
                onClick={() => setConfirmDelete(false)}
                variant="secondary"
              >
                Cancel
              </Button>
            </div>
          </div>
        )}
      </div>
      
      {/* Cover Image */}
      {post.coverImage && (
        <div className="mb-8">
          <img
            src={post.coverImage}
            alt={post.title}
            className="w-full h-auto rounded-lg"
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/1200x600?text=Image+Not+Found';
            }}
          />
        </div>
      )}
      
      {/* Post Content */}
      <div className="prose dark:prose-invert max-w-none mb-8">
        <div dangerouslySetInnerHTML={{ __html: post.content.replace(/\n/g, '<br />') }} />
      </div>
      
      {/* Post Actions */}
      <div className="flex items-center justify-between py-4 border-t border-b border-gray-200 dark:border-gray-700 mb-8">
        <button
          onClick={handleLikePost}
          className={`flex items-center ${
            isLiked ? 'text-red-500 dark:text-red-400' : 'text-gray-600 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400'
          }`}
        >
          {isLiked ? (
            <HeartIconSolid className="w-6 h-6 mr-2" />
          ) : (
            <HeartIcon className="w-6 h-6 mr-2" />
          )}
          <span>{post.likes} {post.likes === 1 ? 'Like' : 'Likes'}</span>
        </button>
        
        <div className="flex items-center text-gray-600 dark:text-gray-400">
          <ChatBubbleLeftIcon className="w-6 h-6 mr-2" />
          <span>{post.comments?.length || 0} {post.comments?.length === 1 ? 'Comment' : 'Comments'}</span>
        </div>
      </div>
      
      {/* Comments Section */}
      <CommentSection
        comments={post.comments}
        postId={post._id}
        onAddComment={handleAddComment}
        onDeleteComment={handleDeleteComment}
      />
    </div>
  );
};

export default PostDetails; 