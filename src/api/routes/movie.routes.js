const express = require('express');
const router = express.Router();
const movieController = require('../controllers/movie.controller');

// Defines the GET endpoint at the root of this router (/api/movies)
router.get('/', movieController.getMovies);

module.exports = router;