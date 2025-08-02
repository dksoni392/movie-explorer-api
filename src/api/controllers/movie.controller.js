const { Movie, Genre, Cast, sequelize } = require('../../models');
const { Op } = require('sequelize'); // Import the Op object for advanced queries

const getMovies = async (req, res) => {
  try {
    // --- Pagination ---
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const offset = (page - 1) * limit;

    // --- Build Query Options Dynamically ---
    const options = {
      limit,
      offset,
      where: {},
      include: [
        {
          model: Genre,
          attributes: ['name'],
          through: { attributes: [] },
        },
        {
          model: Cast,
          attributes: ['name', 'character'],
          through: { attributes: [] },
        },
      ],
      distinct: true, // Important for ensuring correct counts with includes
    };

    // --- Filtering ---
    if (req.query.year) {
      const year = parseInt(req.query.year, 10);
      options.where.release_date = {
        [Op.between]: [`${year}-01-01`, `${year}-12-31`],
      };
    }

    if (req.query.genres) {
      const genres = req.query.genres.split(',');
      options.include[0].where = { name: { [Op.in]: genres } };
    }
    
    // --- Sorting ---
    if (req.query.sort_by) {
        const [field, order = 'asc'] = req.query.sort_by.split('.');
        const validFields = ['popularity', 'vote_average', 'vote_count', 'release_date', 'revenue', 'title'];
        if (validFields.includes(field)) {
            options.order = [[field, order.toUpperCase()]];
        }
    }

    // --- Searching ---
     if (req.query.search) {
        const searchTerm = `%${req.query.search}%`;
        options.where[Op.or] = [
            { title: { [Op.like]: searchTerm } },
            // To search cast, we need to modify the include for Cast
            // This is a more complex query, so we'll add it to the include options
        ];
        // This search implementation is basic. A more robust search would require modifying the include for Cast as well.
     }


    const { count, rows } = await Movie.findAndCountAll(options);

    res.status(200).json({
      totalItems: count,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      movies: rows,
    });
  } catch (error) {
    console.error('Error fetching movies:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.zero = {
    getMovies,
};

module.exports = {
  getMovies,
};