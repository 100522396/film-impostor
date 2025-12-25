export type Role = 'Impostor' | 'Normal';

export interface Player {
    id: number;
    role: Role;
    isRevealed: boolean;
}

export interface Movie {
    id: number;
    title: string;
    genre: string;
    overview: string;
    poster_path: string | null;
    release_year?: string;
    keywords?: string[];
}

export type GamePhase = 'SETUP' | 'LOADING' | 'PASS_DEVICE' | 'REVEAL' | 'PLAYING';

export interface GameState {
    players: Player[];
    playerCount: number;
    currentPlayerIndex: number; // For the "Pass Device" flow
    currentMovie: Movie | null;
    phase: GamePhase;
}
