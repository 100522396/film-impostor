const TMDB_API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';

import { Movie } from '@/types';

// Simple genre map for Spanish localization (ID -> Name)
const GENRES: Record<number, string> = {
    28: 'Acción',
    12: 'Aventura',
    16: 'Animación',
    35: 'Comedia',
    80: 'Crimen',
    99: 'Documental',
    18: 'Drama',
    10751: 'Familia',
    14: 'Fantasía',
    36: 'Historia',
    27: 'Terror',
    10402: 'Música',
    9648: 'Misterio',
    10749: 'Romance',
    878: 'Ciencia ficción',
    10770: 'Película de TV',
    53: 'Suspense',
    10752: 'Bélica',
    37: 'Western',
};

async function fetchFromTMDB(endpoint: string, params: Record<string, string> = {}) {
    if (!TMDB_API_KEY) {
        throw new Error('Missing TMDB API Key');
    }
    const query = new URLSearchParams({
        api_key: TMDB_API_KEY,
        language: 'es-ES', // Spanish
        ...params,
    });

    const res = await fetch(`${BASE_URL}${endpoint}?${query}`);
    if (!res.ok) {
        throw new Error(`TMDB Error: ${res.statusText}`);
    }
    return res.json();
}

export type Decade = 'ALL' | '80s' | '90s' | '00s' | '10s' | '20s';
export type Difficulty = 'TOP_100' | 'TOP_500' | 'HARDCORE';

interface FilterOptions {
    decade: Decade;
    difficulty: Difficulty;
}

const DECADE_RANGES: Record<Decade, { min: string, max: string }> = {
    'ALL': { min: '1970-01-01', max: '2025-12-31' },
    '80s': { min: '1980-01-01', max: '1989-12-31' },
    '90s': { min: '1990-01-01', max: '1999-12-31' },
    '00s': { min: '2000-01-01', max: '2009-12-31' },
    '10s': { min: '2010-01-01', max: '2019-12-31' },
    '20s': { min: '2020-01-01', max: '2029-12-31' },
};

export async function getRandomMovie(filters: FilterOptions): Promise<Movie> {
    // Discovery params
    const { min, max } = DECADE_RANGES[filters.decade];

    // Base params for discovery
    const baseParams: Record<string, string> = {
        'sort_by': 'popularity.desc',
        'primary_release_date.gte': min,
        'primary_release_date.lte': max,
        'include_adult': 'false',
        'include_video': 'false',
        'vote_count.gte': '500', // Ensure some popularity
    };

    // Determine page depth based on difficulty
    // TOP_100 -> ~5 pages (20 items/page)
    // TOP_500 -> ~25 pages
    // HARDCORE -> ~100 pages (Top 2000)
    let maxPage = 5;
    if (filters.difficulty === 'TOP_500') maxPage = 25;
    if (filters.difficulty === 'HARDCORE') maxPage = 100;

    const randomPage = Math.floor(Math.random() * maxPage) + 1;

    const data = await fetchFromTMDB('/discover/movie', {
        ...baseParams,
        page: randomPage.toString()
    });

    const results = data.results;

    if (!results || results.length === 0) {
        throw new Error('No movies found');
    }

    // 2. Pick a random movie from the results
    const randomMovie = results[Math.floor(Math.random() * results.length)];

    // 3. Map primary genre
    const genreId = randomMovie.genre_ids?.[0];
    const genreName = GENRES[genreId] || 'Género desconocido';

    return {
        id: randomMovie.id,
        title: randomMovie.title,
        genre: genreName,
        overview: randomMovie.overview,
        poster_path: randomMovie.poster_path,
    };
}
