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
export type Difficulty = 'TOP_100' | 'TOP_500' | 'HARDCORE' | 'CLASSICS';

interface FilterOptions {
    decade: Decade;
    difficulty: Difficulty;
    year?: number;
}

const DECADE_RANGES: Record<Decade, { min: string, max: string }> = {
    'ALL': { min: '1970-01-01', max: '2025-12-31' },
    '80s': { min: '1980-01-01', max: '1989-12-31' },
    '90s': { min: '1990-01-01', max: '1999-12-31' },
    '00s': { min: '2000-01-01', max: '2009-12-31' },
    '10s': { min: '2010-01-01', max: '2019-12-31' },
    '20s': { min: '2020-01-01', max: '2029-12-31' },
};

function getBaseParams(filters: FilterOptions): Record<string, string> {
    // For CLASSICS, we sort by vote count (all time favorites). For others, popularity (current/general trends).
    const sortBy = filters.difficulty === 'CLASSICS' ? 'vote_count.desc' : 'popularity.desc';

    const baseParams: Record<string, string> = {
        'sort_by': sortBy,
        'include_adult': 'false',
        'include_video': 'false',
        'vote_count.gte': '300',
    };

    if (filters.year) {
        baseParams['primary_release_year'] = filters.year.toString();
    } else {
        const { min, max } = DECADE_RANGES[filters.decade];
        baseParams['primary_release_date.gte'] = min;
        baseParams['primary_release_date.lte'] = max;
    }

    return baseParams;
}

export async function getRandomMovie(filters: FilterOptions): Promise<Movie> {
    const baseParams = getBaseParams(filters);

    // Determine page depth based on difficulty
    let maxPage = 5; // TOP_100 default

    if (filters.difficulty === 'TOP_500') maxPage = 25;
    if (filters.difficulty === 'HARDCORE') maxPage = 100;
    if (filters.difficulty === 'CLASSICS') maxPage = 15; // Top 300 voted movies

    // If specific year is set, reduce max page depth as there are fewer movies per year
    if (filters.year) maxPage = Math.min(maxPage, 10);

    const randomPage = Math.floor(Math.random() * maxPage) + 1;

    const data = await fetchFromTMDB('/discover/movie', {
        ...baseParams,
        page: randomPage.toString()
    });

    const results = data.results;

    if (!results || results.length === 0) {
        throw new Error('No movies found');
    }

    const randomMovie = results[Math.floor(Math.random() * results.length)];
    return mapMovie(randomMovie);
}

export async function getMoviePool(filters: FilterOptions): Promise<Movie[]> {
    const baseParams = getBaseParams(filters);

    // Fetch 3 pages (60 movies)
    const pages = [1, 2, 3];
    const promises = pages.map(page =>
        fetchFromTMDB('/discover/movie', { ...baseParams, page: page.toString() })
    );

    const responses = await Promise.all(promises);
    const allResults = responses.flatMap(r => r.results);

    // Map and Deduplicate by ID just in case
    const movies = allResults.map(mapMovie);
    const uniqueMovies = Array.from(new Map(movies.map(m => [m.id, m])).values());

    return uniqueMovies;
}

function mapMovie(raw: any): Movie {
    const genreId = raw.genre_ids?.[0];
    const genreName = GENRES[genreId] || 'Género desconocido';
    return {
        id: raw.id,
        title: raw.title,
        genre: genreName,
        overview: raw.overview,
        poster_path: raw.poster_path,
    };
}
