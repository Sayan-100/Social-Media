const express = require('express');
const likeController = require('../controllers/like_controller');

const router = express.Router();

router.post('/toggle', likeController.toggleLike);

module.exports = router;