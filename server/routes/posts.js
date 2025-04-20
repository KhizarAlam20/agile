const express = require('express');
const router = express.Router();
const {
  createPost,
  getPosts,
  getPost,
  updatePost,
  deletePost,
  likePost,
  addComment,
  deleteComment,
} = require('../controllers/postController');
const { protect } = require('../middleware/auth');

// Get all posts and create a post
router.route('/').get(getPosts).post(protect, createPost);

// Get, update, and delete a post
router
  .route('/:id')
  .get(getPost)
  .put(protect, updatePost)
  .delete(protect, deletePost);

// Like a post
router.put('/:id/like', protect, likePost);

// Add and delete comments
router.post('/:id/comments', protect, addComment);
router.delete('/:id/comments/:commentId', protect, deleteComment);

module.exports = router; 