import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import { postsAPI } from '../utils/api';
import Card, { CardHeader, CardBody } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Alert from '../components/ui/Alert';
import Pagination from '../components/ui/Pagination';
import { formatDate } from '../utils/helpers';
import { PencilIcon, TrashIcon, EyeIcon } from '@heroicons/react/24/outline';

const Dashboard = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [postToDelete, setPostToDelete] = useState(null);
  
  // Fetch user's posts
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        // Assuming the API supports filtering by author
        const response = await postsAPI.getPosts(currentPage, 10, '', '', '');
        
        // Filter posts by the current user (if API doesn't support filtering)
        const userPosts = response.data.posts.filter(post => post.author._id === user._id);
        
        setPosts(userPosts);
        setTotalPages(Math.ceil(response.data.totalCount / 10));
      } catch (err) {
        setError('Failed to fetch your posts. Please try again later.');
        console.error('Error fetching posts:', err);
      } finally {
        setLoading(false);
      }
    };
    
    if (user) {
      fetchPosts();
    }
  }, [currentPage, user]);
  
  // Handle delete post
  const handleDeletePost = async (id) => {
    try {
      await postsAPI.deletePost(id);
      
      // Update posts state
      setPosts(prevPosts => prevPosts.filter(post => post._id !== id));
      
      toast.success('Post deleted successfully');
      setPostToDelete(null);
    } catch (err) {
      toast.error('Failed to delete post. Please try again.');
      console.error('Error deleting post:', err);
    }
  };
  
  // Stats section
  const renderStats = () => {
    const publishedPosts = posts.filter(post => post.status === 'published').length;
    const draftPosts = posts.filter(post => post.status === 'draft').length;
    const totalLikes = posts.reduce((sum, post) => sum + post.likes, 0);
    const totalComments = posts.reduce((sum, post) => sum + (post.comments?.length || 0), 0);
    
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card className="bg-primary-50 dark:bg-primary-900/30 border border-primary-100 dark:border-primary-800">
          <CardBody className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300">Total Posts</h3>
              <p className="text-3xl font-bold text-primary-600 dark:text-primary-400">{posts.length}</p>
            </div>
            <div className="p-3 bg-primary-100 dark:bg-primary-800 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary-600 dark:text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
              </svg>
            </div>
          </CardBody>
        </Card>
        
        <Card className="bg-blue-50 dark:bg-blue-900/30 border border-blue-100 dark:border-blue-800">
          <CardBody className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300">Published</h3>
              <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{publishedPosts}</p>
            </div>
            <div className="p-3 bg-blue-100 dark:bg-blue-800 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </CardBody>
        </Card>
        
        <Card className="bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-100 dark:border-yellow-800">
          <CardBody className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300">Drafts</h3>
              <p className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">{draftPosts}</p>
            </div>
            <div className="p-3 bg-yellow-100 dark:bg-yellow-800 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-600 dark:text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </div>
          </CardBody>
        </Card>
        
        <Card className="bg-red-50 dark:bg-red-900/30 border border-red-100 dark:border-red-800">
          <CardBody className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300">Likes</h3>
              <p className="text-3xl font-bold text-red-600 dark:text-red-400">{totalLikes}</p>
            </div>
            <div className="p-3 bg-red-100 dark:bg-red-800 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
          </CardBody>
        </Card>
      </div>
    );
  };
  
  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
        <Link to="/create-post">
          <Button>Create New Post</Button>
        </Link>
      </div>
      
      {/* Stats Cards */}
      {!loading && !error && posts.length > 0 && renderStats()}
      
      {/* Posts Table */}
      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
            Your Posts
          </h2>
        </CardHeader>
        
        <CardBody>
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
            </div>
          ) : error ? (
            <Alert
              type="error"
              message={error}
              className="mb-4"
            />
          ) : posts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                You haven't created any posts yet.
              </p>
              <Link to="/create-post">
                <Button>Create Your First Post</Button>
              </Link>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-800">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Title
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Status
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Date
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Views
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {posts.map((post) => (
                      <tr key={post._id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {post.title}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                            ${post.status === 'published' 
                              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' 
                              : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'}`}
                          >
                            {post.status === 'published' ? 'Published' : 'Draft'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {formatDate(post.createdAt)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {post.views || 0}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <Link 
                              to={`/posts/${post._id}`}
                              className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300"
                              title="View"
                            >
                              <EyeIcon className="h-5 w-5" />
                            </Link>
                            <Link 
                              to={`/edit-post/${post._id}`}
                              className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-900 dark:hover:text-indigo-300"
                              title="Edit"
                            >
                              <PencilIcon className="h-5 w-5" />
                            </Link>
                            <button
                              onClick={() => setPostToDelete(post)}
                              className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300"
                              title="Delete"
                            >
                              <TrashIcon className="h-5 w-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {/* Pagination */}
              {totalPages > 1 && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                  className="mt-6"
                />
              )}
            </>
          )}
        </CardBody>
      </Card>
      
      {/* Delete Confirmation Modal */}
      {postToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Confirm Delete
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Are you sure you want to delete "{postToDelete.title}"? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <Button
                variant="secondary"
                onClick={() => setPostToDelete(null)}
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                onClick={() => handleDeletePost(postToDelete._id)}
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard; 