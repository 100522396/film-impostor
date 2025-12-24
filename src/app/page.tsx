"use client";

import { useGame, GameProvider } from '@/contexts/GameContext';
import { SetupScreen } from '@/components/SetupScreen';
import { PassDeviceScreen } from '@/components/PassDeviceScreen';
import { RevealScreen } from '@/components/RevealScreen';
import { Button } from '@/components/ui/Button';
import { useState } from 'react';
import { RotateCcw } from 'lucide-react';

function GameContent() {
    const { phase, resetGame } = useGame();
    const [showRole, setShowRole] = useState(false);

    // States:
    // SETUP: SetupScreen
    // PASS_DEVICE: PassDeviceScreen -> (onReady) -> RevealScreen -> (Next) -> PassDeviceScreen
    // PLAYING: "Game Over" / Discussion screen.

    if (phase === 'SETUP') {
        return <SetupScreen />;
    }

    if (phase === 'PASS_DEVICE') {
        if (showRole) {
            return <RevealScreen />; // This component handles calling nextPlayer, which updates phase/index
        }
        return <PassDeviceScreen onReady={() => setShowRole(true)} />;
    }

    // Need to reset showRole when index changes or phase changes?
    // We can track lastIndex.
    // Actually, separating Pass and Reveal into two sub-states in component memory is tricky if not in context.
    // Let's refine:
    // PassDeviceScreen shows "Pass...". Click "Ready" -> Switch local state to show Reveal.
    // RevealScreen clicks "Next" -> Calls `nextPlayer`. 
    // `nextPlayer` updates index in context.
    // We need to detect that index changed and reset local `showRole` to false.

    // Actually, let's wrap this logic better.
    return <GameOrchestrator />;
}

function GameOrchestrator() {
    const { phase, resetGame, currentPlayerIndex } = useGame();
    const [showingRole, setShowingRole] = useState(false);
    const [lastSeenIndex, setLastSeenIndex] = useState(-1);

    // Reset local state when a new player turn starts
    if (phase === 'PASS_DEVICE' && currentPlayerIndex !== lastSeenIndex) {
        setShowingRole(false);
        setLastSeenIndex(currentPlayerIndex);
    }

    if (phase === 'SETUP') return <SetupScreen />;

    if (phase === 'PLAYING') {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-8 animate-in zoom-in">
                <div className="text-center space-y-4">
                    <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-orange-400">
                        ¡A DEBATIR!
                    </h1>
                    <p className="text-xl text-gray-300">
                        Encontrad al impostor entre vosotros.
                    </p>
                </div>
                <div className="p-8 bg-gray-800/50 rounded-2xl border border-gray-700">
                    <ul className="text-left list-disc list-inside text-gray-400 space-y-2">
                        <li>Haced preguntas sobre la película.</li>
                        <li>Las respuestas no deben ser demasiado obvias.</li>
                        <li>Si el impostor adivina la peli, ¡gana!</li>
                    </ul>
                </div>
                <Button onClick={resetGame} variant="secondary" className="w-full max-w-xs flex gap-2 justify-center items-center">
                    <RotateCcw className="w-5 h-5" /> Nueva Partida
                </Button>
            </div>
        );
    }

    // PASS_DEVICE phase
    if (showingRole) {
        return <RevealScreen />;
    }

    return <PassDeviceScreen onReady={() => setShowingRole(true)} />;
}

export default function Home() {
    return (
        <main className="min-h-screen bg-gray-950 text-gray-100 p-4 md:p-8 font-sans selection:bg-indigo-500/30">
            <div className="max-w-2xl mx-auto">
                <GameProvider>
                    <GameOrchestrator />
                </GameProvider>
            </div>

            {/* Background decoration */}
            <div className="fixed inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/20 via-gray-950 to-gray-950 pointer-events-none" />
        </main>
    );
}
