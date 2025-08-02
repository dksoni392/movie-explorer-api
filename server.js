require('dotenv').config();
const express = require('express');
const { sequelize } = require('./src/models');
const movieRoutes = require('./src/api/routes/movie.routes'); // Import the new routes

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Tell the app to use our movie routes for any path starting with /api/movies
app.use('/api/movies', movieRoutes);

const startServer = async () => {
  try {
    await sequelize.sync();
    console.log('✅ Database synchronized');
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('❌ Unable to start server:', error);
  }
};

startServer();