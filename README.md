# Movie Explorer API

This is a backend application for exploring movie data, built as a backend assessment task. The application fetches data from TMDB (The Movie Database), stores it in a local relational database, and exposes a RESTful API to query the data with pagination, filtering, sorting, and searching capabilities.

## Features

* **Data Seeding**: A script to populate the local database with movie data from the TMDB API or a provided fallback.
* **RESTful API**: A `GET /api/movies` endpoint to retrieve movie data.
* **Pagination**: The API supports `page` and `limit` query parameters.
* **Filtering**: Filter movies by `year` and `genres`.
* **Sorting**: Sort results by various fields like `popularity`, `release_date`, and `title`.
* **Searching**: A basic text search for movie titles.

## Technology Stack

* **Backend**: Node.js, Express.js
* **Database**: MySQL (can be adapted for PostgreSQL)
* **ORM**: Sequelize
* **API Client**: Axios

---

## Setup and Installation

### Prerequisites

* Node.js and npm
* MySQL (or another relational database) installed and running locally

### Installation Steps

1.  **Clone the repository**
    ```bash
    git clone <your-repository-url>
    cd movie-explorer-api
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Set up environment variables**
    Create a `.env` file in the root of the project and add the following configuration.

    ```env
    # Server Configuration
    PORT=3000

    # TMDB API Configuration
    TMDB_API_KEY=eec8ca18da6c9523e3f50a8c6f69c633

    # Database Configuration (MySQL)
    DB_DIALECT=mysql
    DB_HOST=localhost
    DB_PORT=3306
    DB_USER=root
    DB_PASSWORD=your_database_password
    DB_NAME=movie_explorer_db
    ```
    Update the `DB_PASSWORD` and other database variables to match your local setup.

4.  **Create the database**
    Connect to your local MySQL instance and run the following command:
    ```sql
    CREATE DATABASE movie_explorer_db;
    ```

5.  **Run the database seeder**
    This script will populate your database with the movie data.
    ```bash
    npm run seed
    ```

6.  **Start the server**
    ```bash
    npm run dev
    ```
    The server will start on `http://localhost:3000`.

---

## API Endpoints

### Get Movie List

Retrieves a paginated list of movies with filtering, sorting, and searching.

* **URL**: `/api/movies`
* **Method**: `GET`
* **Query Parameters**:
    * `page` (number): The page number to retrieve. Default: `1`.
    * `limit` (number): The number of items per page. Default: `10`.
    * `year` (number): Filter movies by a specific release year.
    * `genres` (string): A comma-separated list of genre names to filter by (e.g., `Action,Fantasy`).
    * `sort_by` (string): The field to sort by, with an optional order (e.g., `popularity.desc`, `release_date.asc`).
    * `search` (string): A search term to find in movie titles.

* **Example Requests**:
    * `http://localhost:3000/api/movies?page=1&limit=5`
    * `http://localhost:3000/api/movies?year=2025`
    * `http://localhost:3000/api/movies?genres=Action`
    * `http://localhost:3000/api/movies?sort_by=popularity.desc`
    * `http://localhost:3000/api/movies?search=Minecraft`