import { useGame } from '@/contexts/GameContext';
import { Button } from './ui/Button';
import { Card } from './ui/Card';
import { Smartphone } from 'lucide-react';

interface Props {
    onReady: () => void;
}

export function PassDeviceScreen({ onReady }: Props) {
    const { currentPlayerIndex, playerCount } = useGame();

    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-8 animate-in slide-in-from-right duration-500">
            <Card className="w-full max-w-md space-y-8 py-12">
                <div className="relative">
                    <div className="absolute inset-0 bg-indigo-500 blur-3xl opacity-20 rounded-full animate-pulse" />
                    <Smartphone className="w-24 h-24 text-indigo-400 mx-auto relative z-10" />
                </div>

                <div className="space-y-2">
                    <h2 className="text-2xl font-bold text-gray-200">
                        Pasa el móvil al
                    </h2>
                    <div className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
                        Jugador {currentPlayerIndex + 1}
                    </div>
                </div>

                <p className="text-gray-400">
                    Asegúrate de que nadie más mire la pantalla
                </p>

                <Button onClick={onReady} className="mt-8">
                    Ver mi Rol
                </Button>

                <div className="text-sm text-gray-600">
                    {currentPlayerIndex + 1} de {playerCount}
                </div>
            </Card>
        </div>
    );
}
