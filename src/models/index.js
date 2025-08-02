const { sequelize } = require('../config/database');
const Movie = require('./movie.model');
const Genre = require('./genre.model');
const Cast = require('./cast.model');

// A movie can have many genres, and a genre can be in many movies.
// Sequelize will create a "junction table" called MovieGenres to manage this link.
Movie.belongsToMany(Genre, { through: 'MovieGenres' });
Genre.belongsToMany(Movie, { through: 'MovieGenres' });

// A movie can have many cast members, and a cast member can be in many movies.
Movie.belongsToMany(Cast, { through: 'MovieCast' });
Cast.belongsToMany(Movie, { through: 'MovieCast' });

// Export all the models and the sequelize instance
module.exports = {
  sequelize,
  Movie,
  Genre,
  Cast,
};