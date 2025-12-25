"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { GameState, Player, Role, GamePhase, Movie } from '@/types';
import { getRandomMovie, Decade, Difficulty } from '@/lib/tmdb';

interface GameContextType extends GameState {
    startGame: (count: number, filters: { decade: Decade; difficulty: Difficulty; year?: number }, enabledHints?: string[]) => Promise<void>;
    nextPlayer: () => void;
    resetGame: () => void;
    isLoading: boolean;
    error: string | null;
    customPool: Movie[];
    setCustomPool: (movies: Movie[]) => void;
    enabledHints: string[];
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export function GameProvider({ children }: { children: ReactNode }) {
    const [gameState, setGameState] = useState<GameState>({
        players: [],
        playerCount: 0,
        currentPlayerIndex: 0,
        currentMovie: null,
        phase: 'SETUP',
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [customPool, setCustomPool] = useState<Movie[]>([]);
    const [enabledHints, setEnabledHints] = useState<string[]>(['GENRE']);

    const startGame = async (
        count: number,
        filters: { decade: Decade; difficulty: Difficulty; year?: number },
        hitsConfig: string[] = ['GENRE']
    ) => {
        setIsLoading(true);
        setError(null);
        setEnabledHints(hitsConfig);
        try {
            let movie: Movie;

            if (customPool.length > 0) {
                // Pick from custom pool
                const randomIndex = Math.floor(Math.random() * customPool.length);
                movie = customPool[randomIndex];
            } else {
                // Pick from API
                movie = await getRandomMovie(filters);
            }

            // Create players
            const newPlayers: Player[] = Array.from({ length: count }, (_, i) => ({
                id: i,
                role: 'Normal',
                isRevealed: false,
            }));

            // Assign impostor
            const impostorIndex = Math.floor(Math.random() * count);
            newPlayers[impostorIndex].role = 'Impostor';

            setGameState({
                players: newPlayers,
                playerCount: count,
                currentPlayerIndex: 0,
                currentMovie: movie,
                phase: 'PASS_DEVICE',
            });
        } catch (err) {
            console.error(err);
            setError('Error al cargar la película. Revisa tu conexión o API Key.');
        } finally {
            setIsLoading(false);
        }
    };

    const nextPlayer = () => {
        setGameState(prev => {
            const nextIndex = prev.currentPlayerIndex + 1;
            if (nextIndex >= prev.playerCount) {
                return {
                    ...prev,
                    phase: 'PLAYING',
                    currentPlayerIndex: 0,
                };
            }
            return {
                ...prev,
                currentPlayerIndex: nextIndex,
            };
        });
    };

    const resetGame = () => {
        setGameState({
            players: [],
            playerCount: 0,
            currentPlayerIndex: 0,
            currentMovie: null,
            phase: 'SETUP',
        });
        setError(null);
    };

    return (
        <GameContext.Provider value={{ ...gameState, startGame, nextPlayer, resetGame, isLoading, error, customPool, setCustomPool, enabledHints }}>
            {children}
        </GameContext.Provider>
    );
}

export function useGame() {
    const context = useContext(GameContext);
    if (context === undefined) {
        throw new Error('useGame must be used within a GameProvider');
    }
    return context;
}
