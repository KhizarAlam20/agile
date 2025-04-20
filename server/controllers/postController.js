const Post = require('../models/Post');
const User = require('../models/User');

// @desc    Create a new post
// @route   POST /api/posts
// @access  Private
exports.createPost = async (req, res) => {
  try {
    const { title, content, summary, tags, coverImage, status } = req.body;

    // Create post
    const post = await Post.create({
      title,
      content,
      summary,
      author: req.user._id,
      tags: tags || [],
      coverImage: coverImage || '',
      status: status || 'published',
    });

    res.status(201).json({
      success: true,
      post,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get all posts
// @route   GET /api/posts
// @access  Public
exports.getPosts = async (req, res) => {
  try {
    const { page = 1, limit = 10, tag, search, status } = req.query;
    const query = {};

    // Filter by tag
    if (tag) {
      query.tags = tag;
    }

    // Filter by status (for admin or author)
    if (status) {
      if (req.user && (req.user.role === 'admin' || req.user._id.toString() === post.author.toString())) {
        query.status = status;
      } else {
        query.status = 'published';
      }
    } else {
      query.status = 'published';
    }

    // Search by title, content, or tags
    if (search) {
      query.$text = { $search: search };
    }

    // Count total posts
    const total = await Post.countDocuments(query);

    // Find posts with pagination
    const posts = await Post.find(query)
      .populate('author', 'name profilePicture')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    res.status(200).json({
      success: true,
      posts,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get a single post
// @route   GET /api/posts/:id
// @access  Public
exports.getPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('author', 'name profilePicture bio')
      .populate('comments.user', 'name profilePicture');

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found',
      });
    }

    // Check if post is published or user is admin or author
    if (
      post.status === 'draft' &&
      (!req.user || (req.user.role !== 'admin' && req.user._id.toString() !== post.author._id.toString()))
    ) {
      return res.status(404).json({
        success: false,
        message: 'Post not found',
      });
    }

    res.status(200).json({
      success: true,
      post,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Update a post
// @route   PUT /api/posts/:id
// @access  Private
exports.updatePost = async (req, res) => {
  try {
    const { title, content, summary, tags, coverImage, status } = req.body;

    let post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found',
      });
    }

    // Check if user is post author or admin
    if (
      req.user.role !== 'admin' &&
      post.author.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this post',
      });
    }

    // Update post
    post = await Post.findByIdAndUpdate(
      req.params.id,
      {
        title,
        content,
        summary,
        tags,
        coverImage,
        status,
      },
      { new: true, runValidators: true }
    ).populate('author', 'name profilePicture');

    res.status(200).json({
      success: true,
      post,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Delete a post
// @route   DELETE /api/posts/:id
// @access  Private
exports.deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found',
      });
    }

    // Check if user is post author or admin
    if (
      req.user.role !== 'admin' &&
      post.author.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this post',
      });
    }

    await post.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Post deleted',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Like a post
// @route   PUT /api/posts/:id/like
// @access  Private
exports.likePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found',
      });
    }

    // Check if post has already been liked by user
    if (post.likedBy.includes(req.user._id)) {
      // Unlike the post
      post.likes = post.likes - 1;
      post.likedBy = post.likedBy.filter(
        (id) => id.toString() !== req.user._id.toString()
      );
    } else {
      // Like the post
      post.likes = post.likes + 1;
      post.likedBy.push(req.user._id);
    }

    await post.save();

    res.status(200).json({
      success: true,
      likes: post.likes,
      likedBy: post.likedBy,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Add comment to a post
// @route   POST /api/posts/:id/comments
// @access  Private
exports.addComment = async (req, res) => {
  try {
    const { text } = req.body;

    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found',
      });
    }

    // Add comment
    post.comments.unshift({
      user: req.user._id,
      text,
    });

    await post.save();

    // Populate user info in the new comment
    const populatedPost = await Post.findById(req.params.id).populate(
      'comments.user',
      'name profilePicture'
    );

    res.status(201).json({
      success: true,
      comments: populatedPost.comments,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Delete comment from a post
// @route   DELETE /api/posts/:id/comments/:commentId
// @access  Private
exports.deleteComment = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found',
      });
    }

    // Find comment
    const comment = post.comments.find(
      (comment) => comment._id.toString() === req.params.commentId
    );

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found',
      });
    }

    // Check if user is comment author or admin or post author
    if (
      req.user.role !== 'admin' &&
      comment.user.toString() !== req.user._id.toString() &&
      post.author.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this comment',
      });
    }

    // Remove comment
    post.comments = post.comments.filter(
      (comment) => comment._id.toString() !== req.params.commentId
    );

    await post.save();

    res.status(200).json({
      success: true,
      comments: post.comments,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}; 