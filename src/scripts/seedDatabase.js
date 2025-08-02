require('dotenv').config();
const axios = require('axios');
const { sequelize, Movie, Genre, Cast } = require('../models');

// Set up a pre-configured instance of axios
const tmdbApi = axios.create({
  baseURL: 'https://api.themoviedb.org/3',
  params: {
    api_key: process.env.TMDB_API_KEY,
  },
  timeout: 10000, // Add a timeout to prevent hanging forever
});

// --- Fallback Data from PDF ---
const fallbackMovies = [
  {
    "id": 950387,
    "title": "A Minecraft Movie",
    "overview": "Four misfits find themselves struggling with ordinary problems when they are suddenly pulled through a mysterious portal into the Overworld: a bizarre, cubic wonderland that thrives on imagination. To get back home, they'll have to master this world while embarking on a magical quest with an unexpected, expert crafter, Steve.",
    "release_date": "2025-03-31",
    "poster_path": "/iPPTGh20XuIv6d7cwuoPkw8govp.jpg",
    "popularity": 824.7134,
    "vote_average": 6.1,
    "vote_count": 482,
    "budget": 150000000,
    "revenue": 552664857,
    "runtime": 101,
    "genres": [
      { "id": 10751, "name": "Family" },
      { "id": 35, "name": "Comedy" },
      { "id": 12, "name": "Adventure" },
      { "id": 14, "name": "Fantasy" }
    ],
    "cast": [
      { "id": 117642, "name": "Jason Momoa", "character": "Garrett", "order": 0 },
      { "id": 70851, "name": "Jack Black", "character": "Steve", "order": 1 }
    ]
  },
  {
    "id": 324544,
    "title": "In the Lost Lands",
    "overview": "A queen sends the powerful and feared sorceress Gray Alys to the ghostly wilderness of the Lost Lands in search of a magical power, where the sorceress and her guide, the drifter Boyce must outwit and outfight man and demon.",
    "release_date": "2025-02-27",
    "poster_path": "/iHf6bXPghWB6gT8kFkL1zo00x6X.jpg",
    "popularity": 873.5678,
    "vote_average": 5.926,
    "vote_count": 101,
    "budget": 55000000,
    "revenue": 4755330,
    "runtime": 102,
    "genres": [
      { "id": 14, "name": "Fantasy" },
      { "id": 12, "name": "Adventure" },
      { "id": 28, "name": "Action" }
    ],
    "cast": [
      { "id": 63, "name": "Milla Jovovich", "character": "Gray Alys", "order": 0 },
      { "id": 543530, "name": "Dave Bautista", "character": "Boyce", "order": 1 }
    ]
  }
];


// --- Seeding Logic ---

/**
 * Processes a single movie's data (either from API or fallback)
 * and saves it to the database.
 */
const processMovieData = async (movieData) => {
  const [movie] = await Movie.upsert({
    id: movieData.id,
    title: movieData.title,
    overview: movieData.overview,
    release_date: movieData.release_date,
    poster_path: movieData.poster_path,
    popularity: movieData.popularity,
    vote_average: movieData.vote_average,
    vote_count: movieData.vote_count,
    budget: movieData.budget,
    revenue: movieData.revenue,
    runtime: movieData.runtime,
  });

  if (movieData.genres) {
    for (const genreData of movieData.genres) {
      const [genre] = await Genre.findOrCreate({ where: { id: genreData.id }, defaults: { name: genreData.name } });
      await movie.addGenre(genre);
    }
  }

  if (movieData.cast) {
    for (const castData of movieData.cast) {
      // Only add the first 10 cast members to keep it simple
      if (castData.order < 10) {
        const [castMember] = await Cast.findOrCreate({ where: { id: castData.id }, defaults: { name: castData.name, character: castData.character } });
        await movie.addCast(castMember);
      }
    }
  }
};

/**
 * Attempts to seed the database by fetching live data from the TMDB API.
 */
const seedFromApi = async () => {
  console.log('Attempting to seed database from live TMDB API...');

  const allMovieIds = [];
  const totalPagesToFetch = 25; // 500 movies

  console.log('Fetching movie list...');
  for (let page = 1; page <= totalPagesToFetch; page++) {
    const response = await tmdbApi.get('/discover/movie', { params: { page } });
    response.data.results.forEach(movie => allMovieIds.push(movie.id));
  }
  console.log(`Found ${allMovieIds.length} movies to process.`);

  for (let i = 0; i < allMovieIds.length; i++) {
    const movieId = allMovieIds[i];
    console.log(`Processing movie ${i + 1}/${allMovieIds.length} (ID: ${movieId})`);

    // Get movie details and credits in parallel
    const [detailsResponse, creditsResponse] = await Promise.all([
      tmdbApi.get(`/movie/${movieId}`),
      tmdbApi.get(`/movie/${movieId}/credits`),
    ]);

    const movieData = {
      ...detailsResponse.data,
      cast: creditsResponse.data.cast,
    };
    
    await processMovieData(movieData);
  }
};

/**
 * Seeds the database using the hardcoded fallback data.
 */
const seedFromFallback = async () => {
  console.log('API fetch failed. Seeding database from fallback data...');
  for (const movieData of fallbackMovies) {
    console.log(`Processing fallback movie: ${movieData.title}`);
    await processMovieData(movieData);
  }
};


/**
 * Main execution function
 */
const main = async () => {
  try {
    await seedFromApi();
  } catch (error) {
    console.error('❌ Could not seed from live API. Reason:', error.message);
    await seedFromFallback();
  }
};

// Execute the main function
main()
  .then(() => {
    console.log('✅ Seeding process completed.');
  })
  .catch((err) => {
    console.error('❌ An unexpected error occurred during the seeding process:', err);
  })
  .finally(() => {
    sequelize.close();
  });