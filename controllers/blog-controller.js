const Blog = require('../models/blog');
const BlogSerializer = require('../serializers/blog-serializer');
const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');

exports.get_all_drafts = asyncHandler(async (req, res, next) => {
  const drafts = await Blog.find({ state: 'draft' })
    .sort({ 'last_saved': -1 })
    .exec();  

  const draftList = drafts.map(draft => {
    const serializedBlog = new BlogSerializer(draft);
    serializedBlog.include('id title content last_saved url');
    return serializedBlog.getJSON();
  });

  res.status(200).json({
    drafts: draftList,
  });
});

exports.get_published_blogs = asyncHandler(async (req, res, next) => {
  const published = await Blog.find({ state: 'published' })
    .sort({ 'published_on': -1 })
    .exec();

  const publishedList = published.map(blog => {
    const serializedBlog = new BlogSerializer(blog);
    serializedBlog.include('id title content published_on url');
    return serializedBlog.getJSON();
  });

  res.status(200).json({
    blogs: publishedList,
  });
});

exports.get_blog = asyncHandler(async (req, res, next) => {
  if (!req.params.id) {
    const err = new Error('The id parameter is required!');
    err.status = 400;
    return next(err);
  }

  const blog = await Blog.findById(req.params.id);

  const serializedBlog = new BlogSerializer(blog).getJSON();

  res.status(200).json({
    blog: serializedBlog,
  });
});

exports.create_draft = asyncHandler(async (req, res, next) => {
  console.log('i do get here');
  const blog = new Blog();
  await blog.save();
  console.log('do i get here though');
  return res.status(200).json({
    message: 'Draft created successfully!',
    blog_id: blog._id,
  });
});

const validateDraft = () => {
  return [
    body('title')
    .trim()
    .isLength({ min: 3, max: 100 })
    .exists()
    .escape(),

    body('content')
    .trim()
    .isLength({ min: 50 })
    .exists()
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
      _id: req.params.id,
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
      published_on: Date.now(),
      state: 'published',
      scheduled_to_be_published_on: req.body.scheduled_to_be_published_on,
      _id: req.params.id,
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