import { useState } from 'react';
import { useGame } from '@/contexts/GameContext';
import { Button } from './ui/Button';
import { Card } from './ui/Card';
import { Users, Play, Filter } from 'lucide-react';
import { Decade, Difficulty } from '@/lib/tmdb';

export function SetupScreen() {
    const { startGame, isLoading, error } = useGame();
    const [count, setCount] = useState(4);
    const [decade, setDecade] = useState<Decade>('ALL');
    const [difficulty, setDifficulty] = useState<Difficulty>('TOP_100');

    const handleStart = () => {
        startGame(count, { decade, difficulty });
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6 animate-in fade-in zoom-in duration-500 py-6">
            <div className="space-y-2">
                <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">
                    Film Impostor
                </h1>
                <p className="text-gray-400">Descubre quién no ha visto la película</p>
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

                    {/* Decade Selector */}
                    <div className="space-y-2">
                        <span className="text-xs text-gray-500 uppercase tracking-widest">Década</span>
                        <div className="grid grid-cols-3 gap-2">
                            {(['ALL', '80s', '90s', '00s', '10s', '20s'] as Decade[]).map((d) => (
                                <button
                                    key={d}
                                    onClick={() => setDecade(d)}
                                    className={`px-2 py-2 rounded-lg text-sm font-semibold transition-all ${decade === d
                                            ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/25'
                                            : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                                        }`}
                                >
                                    {d === 'ALL' ? 'Todas' : d}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Difficulty Selector */}
                    <div className="space-y-2">
                        <span className="text-xs text-gray-500 uppercase tracking-widest">Popularidad</span>
                        <div className="flex gap-2">
                            {(['TOP_100', 'TOP_500', 'HARDCORE'] as Difficulty[]).map((d) => (
                                <button
                                    key={d}
                                    onClick={() => setDifficulty(d)}
                                    className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${difficulty === d
                                            ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/25'
                                            : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                                        }`}
                                >
                                    {d === 'TOP_100' && 'Top 100'}
                                    {d === 'TOP_500' && 'Top 500'}
                                    {d === 'HARDCORE' && 'Cinéfilo'}
                                </button>
                            ))}
                        </div>
                    </div>
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
