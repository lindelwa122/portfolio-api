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

const validateDraft = () => {
  return [
    body('title')
    .trim()
    .isLength({ min: 3, max: 50 })
    .exists()
    .escape(),

    body('content')
    .trim()
    .isLength({ min: 50 })
    .exists()
    .escape()
  ];
}

const createError = (next, msg, status) => {
  const err = new Error(msg);
  err.status = status ?? 400;
  return next(err);
}

exports.save_draft = [
  validateDraft(),

  asyncHandler(async (req, res, next) => {
    if (!req.params.id) {
      return createError(
        next,
        'The id parameter is required!'
      )
    }

    const blog = new Blog({
      title: req.body.title,
      content: req.body.content,
      last_saved: Date.now(),
    });

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return createError(
        next,
        'The body has invalid information!'
      );
    } else {
      const updatedBlog = await Blog.findByIdAndUpdate(req.params.id, blog, {});

      if (updatedBlog) {
        res.status(200).json({
          message: 'Blog updated successfully!',
        });
      } else {
        return createError(next, "Blog wasn't updated!", 500);
      }
    }
  })
];

exports.publish = [
  validateDraft(),

  body('scheduled_to_be_published_on')
  .optional()
  .isISO8601(),

  asyncHandler(async (req, res, next) => {
    if (!req.params.id) {
      return createError(
        next,
        'The id parameter is required!'
      )
    }

    const blog = new Blog({
      title: req.body.title,
      content: req.body.content,
      last_saved: Date.now(),
      state: 'published',
      scheduled_to_be_published_on: req.body.scheduled_to_be_published_on,
    });

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return createError(
        next,
        'The body has invalid information!'
      );
    } else {
      const updatedBlog = await Blog.findByIdAndUpdate(req.params.id, blog, {});

      if (updatedBlog) {
        res.status(200).json({
          message: 'Blog updated successfully!',
        });
      } else {
        return createError(next, "Blog wasn't updated!", 500);
      }
    }
  })
]