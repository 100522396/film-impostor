import { useState, useEffect } from 'react';
import { useGame } from '@/contexts/GameContext';
import { Button } from './ui/Button';
import { Card } from './ui/Card';
import { getMoviePool, Decade, Difficulty } from '@/lib/tmdb';
import { Movie } from '@/types';
import { Check, X, ArrowLeft, Loader2 } from 'lucide-react';
import clsx from 'clsx';

interface Props {
    filters: { decade: Decade; difficulty: Difficulty; year?: number };
    onClose: () => void;
}

export function PoolSelectionScreen({ filters, onClose }: Props) {
    const { setCustomPool, customPool } = useGame();
    const [candidates, setCandidates] = useState<Movie[]>([]);
    const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchPool() {
            try {
                const movies = await getMoviePool(filters);
                setCandidates(movies);
                // Default to all selected
                setSelectedIds(new Set(movies.map(m => m.id)));
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        }
        fetchPool();
    }, [filters]); // eslint-disable-line react-hooks/exhaustive-deps

    const toggleMovie = (id: number) => {
        const newSet = new Set(selectedIds);
        if (newSet.has(id)) {
            newSet.delete(id);
        } else {
            newSet.add(id);
        }
        setSelectedIds(newSet);
    };

    const saveAndClose = () => {
        const approvedMovies = candidates.filter(m => selectedIds.has(m.id));
        setCustomPool(approvedMovies);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 bg-gray-950 flex flex-col animate-in slide-in-from-bottom duration-300">
            <div className="p-4 border-b border-gray-800 bg-gray-900 flex items-center justify-between sticky top-0 z-10 shadow-lg">
                <button onClick={onClose} className="p-2 text-gray-400 hover:text-white">
                    <ArrowLeft className="w-6 h-6" />
                </button>
                <div className="text-center">
                    <h2 className="font-bold text-white">Revisar Películas</h2>
                    <p className="text-xs text-gray-400 text-center">
                        {selectedIds.size} seleccionadas de {candidates.length}
                    </p>
                </div>
                <button onClick={saveAndClose} className="text-indigo-400 font-bold text-sm">
                    GUARDAR
                </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
                {loading ? (
                    <div className="h-full flex items-center justify-center">
                        <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                        {candidates.map(movie => {
                            const isSelected = selectedIds.has(movie.id);
                            return (
                                <div
                                    key={movie.id}
                                    onClick={() => toggleMovie(movie.id)}
                                    className={clsx(
                                        "relative aspect-[2/3] rounded-xl overflow-hidden cursor-pointer transition-all active:scale-95 border-2",
                                        isSelected ? "border-indigo-500 shadow-indigo-500/20 shadow-lg" : "border-gray-800 opacity-60 grayscale"
                                    )}
                                >
                                    {movie.poster_path ? (
                                        <img
                                            src={`https://image.tmdb.org/t/p/w342${movie.poster_path}`}
                                            alt={movie.title}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-gray-800 flex items-center justify-center p-2 text-center text-xs">
                                            {movie.title}
                                        </div>
                                    )}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-2 pointer-events-none">
                                        <p className="text-white text-xs font-bold line-clamp-2">{movie.title}</p>
                                    </div>
                                    <div className="absolute top-2 right-2">
                                        {isSelected ? (
                                            <div className="bg-indigo-500 rounded-full p-1">
                                                <Check className="w-3 h-3 text-white" />
                                            </div>
                                        ) : (
                                            <div className="bg-gray-700 rounded-full p-1 opacity-50">
                                                <X className="w-3 h-3 text-white" />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            <div className="p-4 border-t border-gray-800 bg-gray-900">
                <Button onClick={saveAndClose} variant="primary" className="py-3 text-sm">
                    Confirmar Selección ({selectedIds.size})
                </Button>
            </div>
        </div>
    );
}
