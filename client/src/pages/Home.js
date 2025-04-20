import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { postsAPI } from '../utils/api';
import PostCard from '../components/blog/PostCard';
import Pagination from '../components/ui/Pagination';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

const Home = () => {
  const { user, isAuthenticated } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState('');
  const [popularTags, setPopularTags] = useState([]);
  
  // Fetch posts
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const response = await postsAPI.getPosts(
          currentPage,
          6,
          selectedTag,
          searchQuery
        );
        setPosts(response.data.posts);
        setTotalPages(response.data.totalPages);
        
        // Extract unique tags from posts for the tag filter
        if (response.data.posts.length > 0 && popularTags.length === 0) {
          const allTags = response.data.posts
            .flatMap(post => post.tags || [])
            .filter(tag => tag);
          
          // Count occurrences of each tag
          const tagCounts = allTags.reduce((acc, tag) => {
            acc[tag] = (acc[tag] || 0) + 1;
            return acc;
          }, {});
          
          // Sort by count and take top 10
          const sortedTags = Object.keys(tagCounts)
            .sort((a, b) => tagCounts[b] - tagCounts[a])
            .slice(0, 10);
          
          setPopularTags(sortedTags);
        }
      } catch (err) {
        setError('Failed to fetch posts. Please try again later.');
        console.error('Error fetching posts:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchPosts();
  }, [currentPage, searchQuery, selectedTag]);
  
  // Handle like post
  const handleLikePost = async (postId) => {
    if (!isAuthenticated) {
      // Redirect to login if not authenticated
      window.location.href = '/login';
      return;
    }
    
    try {
      await postsAPI.likePost(postId);
      
      // Update the posts state to reflect the like
      setPosts(prevPosts =>
        prevPosts.map(post =>
          post._id === postId
            ? {
                ...post,
                likes: post.likedBy?.includes(user._id)
                  ? post.likes - 1
                  : post.likes + 1,
                likedBy: post.likedBy?.includes(user._id)
                  ? post.likedBy.filter(id => id !== user._id)
                  : [...(post.likedBy || []), user._id],
              }
            : post
        )
      );
    } catch (err) {
      console.error('Error liking post:', err);
    }
  };
  
  // Handle search
  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1); // Reset to first page on new search
  };
  
  // Handle tag selection
  const handleTagSelect = (tag) => {
    setSelectedTag(tag === selectedTag ? '' : tag);
    setCurrentPage(1); // Reset to first page on tag change
  };
  
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-16 px-4 rounded-lg mb-12">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Welcome to BlogWeb</h1>
          <p className="text-xl mb-8">
            Discover stories, thinking, and expertise from writers on any topic.
          </p>
          {isAuthenticated && (
            <Link
              to="/create-post"
              className="inline-block bg-white text-primary-700 font-medium px-6 py-3 rounded-md hover:bg-gray-100 transition-colors"
            >
              Write a Story
            </Link>
          )}
        </div>
      </section>
      
      {/* Search and Filters */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Search Form */}
          <form onSubmit={handleSearch} className="flex w-full md:w-auto">
            <div className="relative flex-grow">
              <input
                type="text"
                placeholder="Search posts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 pr-10 border rounded-l-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
              <button
                type="submit"
                className="absolute right-0 top-0 h-full px-3 text-gray-500 dark:text-gray-300"
              >
                <MagnifyingGlassIcon className="w-5 h-5" />
              </button>
            </div>
            <button
              type="submit"
              className="bg-primary-600 text-white px-4 py-2 rounded-r-md hover:bg-primary-700"
            >
              Search
            </button>
          </form>
          
          {/* Tag Filter */}
          <div className="flex flex-wrap gap-2">
            {popularTags.map((tag) => (
              <button
                key={tag}
                onClick={() => handleTagSelect(tag)}
                className={`px-3 py-1 rounded-full text-sm ${
                  selectedTag === tag
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                {tag}
              </button>
            ))}
            {selectedTag && (
              <button
                onClick={() => setSelectedTag('')}
                className="px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      </div>
      
      {/* Posts Grid */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <p className="text-red-500 dark:text-red-400 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700"
          >
            Try Again
          </button>
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-12">
          <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-4">
            No posts found
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            {searchQuery || selectedTag
              ? 'Try a different search term or tag'
              : 'Be the first to create a post!'}
          </p>
          {isAuthenticated && (
            <Link
              to="/create-post"
              className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700"
            >
              Create Post
            </Link>
          )}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <PostCard
                key={post._id}
                post={post}
                onLike={handleLikePost}
                isLiked={post.likedBy?.includes(user?._id)}
              />
            ))}
          </div>
          
          {/* Pagination */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </>
      )}
    </div>
  );
};

export default Home; 