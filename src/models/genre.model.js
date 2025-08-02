const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Genre = sequelize.define('Genre', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  tableName: 'genres',
  timestamps: false, // We don't need createdAt/updatedAt for genres
});

module.exports = Genre;