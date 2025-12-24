import { useState } from 'react';
import { useGame } from '@/contexts/GameContext';
import { Button } from './ui/Button';
import { Card } from './ui/Card';
import { Eye, EyeOff, Film, HelpCircle } from 'lucide-react';
import clsx from 'clsx';

export function RevealScreen() {
    const { players, currentPlayerIndex, currentMovie, nextPlayer } = useGame();
    const [isRevealed, setIsRevealed] = useState(false);

    const player = players[currentPlayerIndex];
    const isImpostor = player.role === 'Impostor';

    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6 animate-in zoom-in duration-300">
            <h2 className="text-2xl font-bold text-gray-300">
                Jugador {currentPlayerIndex + 1}
            </h2>

            <Card className="w-full max-w-md min-h-[300px] flex flex-col items-center justify-center relative overflow-hidden group">

                {/* Secret Content */}
                <div className={clsx(
                    "transition-all duration-500 absolute inset-0 flex flex-col items-center justify-center p-6 space-y-6",
                    isRevealed ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"
                )}>
                    {isImpostor ? (
                        <>
                            <div className="p-4 bg-red-500/10 rounded-full">
                                <HelpCircle className="w-16 h-16 text-red-500" />
                            </div>
                            <div>
                                <h3 className="text-3xl font-black text-red-500 mb-2">ERES EL IMPOSTOR</h3>
                                <p className="text-gray-300">Tu objetivo es pasar desapercibido.</p>
                            </div>
                            <div className="bg-gray-900/50 p-4 rounded-xl w-full">
                                <p className="text-custom-gray text-sm uppercase tracking-wider mb-1">Pista (Género)</p>
                                <p className="text-xl font-bold text-gray-200">{currentMovie?.genre}</p>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="p-4 bg-green-500/10 rounded-full">
                                <Film className="w-16 h-16 text-green-500" />
                            </div>
                            <div>
                                <h3 className="text-3xl font-black text-green-500 mb-2">NO ERES IMPOSTOR</h3>
                                <p className="text-gray-300">La película secreta es:</p>
                            </div>
                            <div className="bg-gray-900/50 p-4 rounded-xl w-full">
                                <p className="text-xl font-bold text-gray-100">{currentMovie?.title}</p>
                            </div>
                        </>
                    )}
                </div>

                {/* Cover / Reveal Button */}
                <div className={clsx(
                    "absolute inset-0 z-10 flex flex-col items-center justify-center bg-gray-800 transition-all duration-500",
                    isRevealed ? "translate-y-full opacity-0" : "translate-y-0 opacity-100"
                )}>
                    <button
                        onClick={() => setIsRevealed(true)}
                        className="flex flex-col items-center space-y-4 group-hover:scale-105 transition-transform"
                    >
                        <div className="p-6 bg-indigo-600 rounded-full shadow-lg shadow-indigo-500/40 animate-bounce">
                            <Eye className="w-12 h-12 text-white" />
                        </div>
                        <span className="font-bold text-xl text-indigo-300">Tocar para revelar</span>
                    </button>
                </div>
            </Card>

            {isRevealed && (
                <Button onClick={nextPlayer} className="animate-in fade-in slide-in-from-bottom-4 delay-500">
                    {currentPlayerIndex + 1 === players.length ? 'Empezar el Juego' : 'Siguiente Jugador'}
                </Button>
            )}
        </div>
    );
}
