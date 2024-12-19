
const express = require('express');
const { createPost, getPosts } = require('../controllers/postController');
const middleware = require('../middlewares/validateRequest')
const router = express.Router();

router.post('/', createPost);
router.get('/',middleware, getPosts);

module.exports = router;