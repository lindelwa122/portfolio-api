const Blog = require('../models/blog');
const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');

exports.create_draft = asyncHandler(async (req, res, next) => {
  const blog = new Blog();
  await blog.save();
  return res.status(200).json({
    message: 'Draft created successfully!',
    blog_id: blog._id,
  });
});