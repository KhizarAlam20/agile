import React from 'react';
import { Link } from 'react-router-dom';
import { HeartIcon, ChatBubbleLeftIcon, CalendarIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';
import Card from '../ui/Card';
import { formatDate } from '../../utils/helpers';

const PostCard = ({ post, onLike, isLiked }) => {
  const {
    _id,
    title,
    summary,
    author,
    createdAt,
    coverImage,
    tags,
    likes,
    comments,
  } = post;

  return (
    <Card className="h-full flex flex-col transition-transform duration-300 hover:-translate-y-1">
      <Link to={`/posts/${_id}`} className="block">
        {coverImage && (
          <div className="h-48 overflow-hidden">
            <img
              src={coverImage}
              alt={title}
              className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/600x300?text=No+Image';
              }}
            />
          </div>
        )}
      </Link>
      
      <div className="p-5 flex-grow flex flex-col">
        {/* Tags */}
        {tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {tags.map((tag, index) => (
              <span
                key={index}
                className="inline-block px-2 py-1 text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-md"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
        
        {/* Title */}
        <Link to={`/posts/${_id}`} className="block">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 hover:text-primary-600 dark:hover:text-primary-400">
            {title}
          </h2>
        </Link>
        
        {/* Summary */}
        <p className="text-gray-600 dark:text-gray-300 mb-4 flex-grow">
          {summary.length > 150 ? `${summary.substring(0, 150)}...` : summary}
        </p>
        
        {/* Author and Date */}
        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-4">
          {author?.profilePicture ? (
            <img
              src={author.profilePicture}
              alt={author.name}
              className="w-8 h-8 rounded-full mr-2"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 mr-2 flex items-center justify-center">
              <span className="text-gray-500 dark:text-gray-300 font-medium">
                {author?.name?.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
          <span>{author?.name}</span>
          <span className="mx-2">•</span>
          <CalendarIcon className="w-4 h-4 mr-1" />
          <span>{formatDate(createdAt)}</span>
        </div>
        
        {/* Likes and Comments */}
        <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 pt-3 border-t border-gray-100 dark:border-gray-700">
          <button
            onClick={(e) => {
              e.preventDefault();
              onLike && onLike(_id);
            }}
            className={`flex items-center ${
              isLiked ? 'text-red-500 dark:text-red-400' : 'hover:text-red-500 dark:hover:text-red-400'
            }`}
          >
            {isLiked ? (
              <HeartIconSolid className="w-5 h-5 mr-1" />
            ) : (
              <HeartIcon className="w-5 h-5 mr-1" />
            )}
            <span>{likes}</span>
          </button>
          
          <Link to={`/posts/${_id}`} className="flex items-center hover:text-primary-600 dark:hover:text-primary-400">
            <ChatBubbleLeftIcon className="w-5 h-5 mr-1" />
            <span>{comments?.length || 0}</span>
          </Link>
        </div>
      </div>
    </Card>
  );
};

export default PostCard; 