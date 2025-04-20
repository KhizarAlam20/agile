import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import Button from '../ui/Button';
import TextArea from '../ui/TextArea';
import { formatRelativeTime, generateAvatarUrl } from '../../utils/helpers';
import { TrashIcon } from '@heroicons/react/24/outline';

const CommentSection = ({ comments, postId, onAddComment, onDeleteComment }) => {
  const { user, isAuthenticated } = useAuth();
  const [commentText, setCommentText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!commentText.trim()) return;
    
    try {
      setIsSubmitting(true);
      await onAddComment(postId, commentText);
      setCommentText('');
    } catch (error) {
      console.error('Error adding comment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (commentId) => {
    try {
      await onDeleteComment(postId, commentId);
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };

  return (
    <div className="mt-8">
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
        Comments ({comments?.length || 0})
      </h3>
      
      {/* Comment Form */}
      {isAuthenticated ? (
        <form onSubmit={handleSubmit} className="mb-8">
          <TextArea
            label="Add a comment"
            name="comment"
            placeholder="Share your thoughts..."
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            rows={3}
          />
          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={!commentText.trim() || isSubmitting}
              className="mt-2"
            >
              {isSubmitting ? 'Posting...' : 'Post Comment'}
            </Button>
          </div>
        </form>
      ) : (
        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-md mb-8">
          <p className="text-gray-700 dark:text-gray-300">
            Please <a href="/login" className="text-primary-600 dark:text-primary-400 hover:underline">log in</a> to leave a comment.
          </p>
        </div>
      )}
      
      {/* Comments List */}
      {comments && comments.length > 0 ? (
        <div className="space-y-6">
          {comments.map((comment) => (
            <div key={comment._id} className="flex space-x-4">
              {/* User Avatar */}
              <div className="flex-shrink-0">
                <img
                  src={comment.user?.profilePicture || generateAvatarUrl(comment.user?.name)}
                  alt={comment.user?.name}
                  className="w-10 h-10 rounded-full"
                />
              </div>
              
              {/* Comment Content */}
              <div className="flex-1 bg-gray-50 dark:bg-gray-800 p-4 rounded-md">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      {comment.user?.name}
                    </h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {formatRelativeTime(comment.date)}
                    </p>
                  </div>
                  
                  {/* Delete Button (for comment author or post author or admin) */}
                  {(user?._id === comment.user?._id || user?.role === 'admin') && (
                    <button
                      onClick={() => handleDelete(comment._id)}
                      className="text-gray-400 hover:text-red-500 dark:hover:text-red-400"
                      aria-label="Delete comment"
                    >
                      <TrashIcon className="w-5 h-5" />
                    </button>
                  )}
                </div>
                
                <p className="mt-2 text-gray-700 dark:text-gray-300">
                  {comment.text}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 dark:text-gray-400 text-center py-4">
          No comments yet. Be the first to share your thoughts!
        </p>
      )}
    </div>
  );
};

export default CommentSection; 