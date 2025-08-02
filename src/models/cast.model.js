const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Cast = sequelize.define('Cast', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  character: {
    type: DataTypes.STRING,
  },
}, {
  tableName: 'cast_members',
  timestamps: false,
});

module.exports = Cast;