"use client";

import { useState } from 'react';
import { useGame } from '@/contexts/GameContext';
import { Button } from './ui/Button';
import { Card } from './ui/Card';
import { Users, Play, Filter, ListChecks } from 'lucide-react';
import { Decade, Difficulty } from '@/lib/tmdb';
import { PoolSelectionScreen } from './PoolSelectionScreen';
import clsx from 'clsx';

export function SetupScreen() {
    const { startGame, isLoading, error, customPool, setCustomPool } = useGame();
    const [count, setCount] = useState(4);
    const [decade, setDecade] = useState<Decade>('ALL');
    const [difficulty, setDifficulty] = useState<Difficulty>('TOP_100');
    const [specificYear, setSpecificYear] = useState<string>('');
    const [showPoolSelection, setShowPoolSelection] = useState(false);

    const handleStart = () => {
        const yearNum = specificYear ? parseInt(specificYear) : undefined;
        startGame(count, { decade, difficulty, year: yearNum });
    };

    const hasCustomPool = customPool.length > 0;

    if (showPoolSelection) {
        const yearNum = specificYear ? parseInt(specificYear) : undefined;
        return (
            <PoolSelectionScreen
                filters={{ decade, difficulty, year: yearNum }}
                onClose={() => setShowPoolSelection(false)}
            />
        );
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6 animate-in fade-in zoom-in duration-500 py-6 pb-24">
            <div className="space-y-2">
                <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">
                    Film Impostor
                </h1>
                <p className="text-gray-400">Descubre quién no ha visto la película</p>
                <p className="text-gray-400">Cano chilea </p>
            </div>

            <Card className="w-full max-w-md space-y-6">

                {/* Player Count */}
                <div className="space-y-3">
                    <label className="block font-medium text-gray-200 flex items-center justify-center gap-2">
                        <Users className="w-4 h-4 text-indigo-400" />
                        Jugadores
                    </label>
                    <div className="flex items-center justify-center space-x-6">
                        <button
                            onClick={() => setCount(c => Math.max(3, c - 1))}
                            className="w-12 h-12 rounded-full bg-gray-700 hover:bg-gray-600 text-white transition-colors flex items-center justify-center text-xl font-bold"
                        >
                            -
                        </button>
                        <span className="text-4xl font-bold font-mono text-indigo-400 w-12 text-center">
                            {count}
                        </span>
                        <button
                            onClick={() => setCount(c => Math.min(12, c + 1))}
                            className="w-12 h-12 rounded-full bg-gray-700 hover:bg-gray-600 text-white transition-colors flex items-center justify-center text-xl font-bold"
                        >
                            +
                        </button>
                    </div>
                </div>

                <div className="h-px bg-gray-700/50" />

                {/* Filters */}
                <div className="space-y-4">
                    <div className="flex items-center justify-center gap-2 text-gray-200 font-medium">
                        <Filter className="w-4 h-4 text-indigo-400" />
                        Configuración
                    </div>

                    {/* Decade / Year Selector */}
                    <div className="space-y-2">
                        <div className="flex justify-between items-center px-1">
                            <span className="text-xs text-gray-500 uppercase tracking-widest">Década</span>
                            <span className="text-xs text-gray-500 uppercase tracking-widest">o Año exacto</span>
                        </div>

                        <div className="flex gap-2">
                            {/* Decade Grid - Disabled if year is set */}
                            <div className={clsx("grid grid-cols-3 gap-2 flex-1 transition-opacity", specificYear ? "opacity-30 pointer-events-none" : "opacity-100")}>
                                {(['ALL', '80s', '90s', '00s', '10s', '20s'] as Decade[]).map((d) => (
                                    <button
                                        key={d}
                                        onClick={() => setDecade(d)}
                                        className={clsx(
                                            "px-1 py-2 rounded-lg text-xs font-bold transition-all",
                                            decade === d
                                                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/25'
                                                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                                        )}
                                    >
                                        {d === 'ALL' ? 'Todas' : d}
                                    </button>
                                ))}
                            </div>

                            {/* Specific Year Input */}
                            <div className="w-20 flex flex-col justify-start">
                                <input
                                    type="number"
                                    placeholder="2024"
                                    value={specificYear}
                                    onChange={(e) => setSpecificYear(e.target.value)}
                                    className="w-full bg-gray-900 border border-gray-700 rounded-lg py-2 px-2 text-center text-white font-mono placeholder:text-gray-600 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Difficulty Selector */}
                    <div className="space-y-2">
                        <span className="text-xs text-gray-500 uppercase tracking-widest">Popularidad</span>
                        <div className="grid grid-cols-2 gap-2">
                            {(['TOP_100', 'TOP_500', 'HARDCORE', 'CLASSICS'] as Difficulty[]).map((d) => (
                                <button
                                    key={d}
                                    onClick={() => setDifficulty(d)}
                                    className={clsx(
                                        "py-2 rounded-lg text-[10px] sm:text-xs font-bold transition-all uppercase",
                                        difficulty === d
                                            ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/25'
                                            : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                                    )}
                                >
                                    {d === 'TOP_100' && 'Top 100'}
                                    {d === 'TOP_500' && 'Top 500'}
                                    {d === 'HARDCORE' && 'Cinéfilo'}
                                    {d === 'CLASSICS' && 'Clásicos ⭐'}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Pool Selection Trigger */}
                <div className="pt-2">
                    <button
                        onClick={() => setShowPoolSelection(true)}
                        className={clsx(
                            "w-full py-3 rounded-xl flex items-center justify-center gap-2 text-sm font-bold transition-all border",
                            hasCustomPool
                                ? "bg-green-500/10 border-green-500/50 text-green-400 hover:bg-green-500/20"
                                : "bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700 hover:border-gray-500"
                        )}
                    >
                        <ListChecks className="w-4 h-4" />
                        {hasCustomPool ? `Pool Personalizado (${customPool.length})` : 'Revisar / Vetar Películas'}
                    </button>
                    {hasCustomPool && (
                        <button onClick={() => setCustomPool([])} className="mt-2 text-xs text-red-400 underline decoration-red-400/50 hover:text-red-300">
                            Borrar selección y usar todo
                        </button>
                    )}
                </div>

                {error && (
                    <div className="p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200 text-sm">
                        {error}
                    </div>
                )}

                <Button onClick={handleStart} disabled={isLoading} className="flex items-center justify-center gap-2 mt-4">
                    {isLoading ? (
                        'Cargando...'
                    ) : (
                        <>
                            <Play className="w-5 h-5" />
                            Empezar
                        </>
                    )}
                </Button>
            </Card>
        </div>
    );
}
