const express = require('express');
const router = express.Router();

const blog_controller = require('../controllers/blog-controller');

router.get('/drafts', blog_controller.get_all_drafts);
router.get('/published', blog_controller.get_published_blogs);
router.get('/:id', blog_controller.get_blog);
router.post('/create-draft', blog_controller.create_draft);
router.post('/save-draft/:id', blog_controller.save_draft);
router.post('/publish/:id', blog_controller.publish);

module.exports = router;
