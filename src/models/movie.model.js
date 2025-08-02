const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Movie = sequelize.define('Movie', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  overview: {
    type: DataTypes.TEXT,
  },
  release_date: {
    type: DataTypes.DATEONLY,
  },
  poster_path: {
    type: DataTypes.STRING,
  },
  popularity: {
    type: DataTypes.FLOAT,
  },
  vote_average: {
    type: DataTypes.FLOAT,
  },
  vote_count: {
    type: DataTypes.INTEGER,
  },
  budget: {
    type: DataTypes.BIGINT,
  },
  revenue: {
    type: DataTypes.BIGINT,
  },
  runtime: {
    type: DataTypes.INTEGER,
  },
}, {
  tableName: 'movies',
  timestamps: true, // Adds createdAt and updatedAt columns
});

module.exports = Movie;