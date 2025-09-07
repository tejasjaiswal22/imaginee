import React, { useState, useCallback } from 'react';
import { GameState, Scene } from './types';
import { generateInitialScene, generateNextScene } from './services/geminiService';
import StartScreen from './components/StartScreen';
import GameScreen from './components/GameScreen';
import ErrorDisplay from './components/ErrorDisplay';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>({
    status: 'start',
    history: [],
    currentScene: null,
    choices: [],
    errorMessage: null,
  });

  const handleStartGame = useCallback(async (initialPrompt: string) => {
    setGameState(prev => ({ ...prev, status: 'loading', errorMessage: null }));
    try {
      const { sceneDescription, image, choices } = await generateInitialScene(initialPrompt);
      const newScene: Scene = { text: sceneDescription, image };
      setGameState({
        status: 'playing',
        history: [newScene],
        currentScene: newScene,
        choices,
        errorMessage: null,
      });
    } catch (error) {
      console.error(error);
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
      setGameState(prev => ({ ...prev, status: 'error', errorMessage }));
    }
  }, []);

  const handleChoice = useCallback(async (choice: string) => {
    setGameState(prev => ({ ...prev, status: 'loading' }));
    try {
      const storyContext = gameState.history.map(s => s.text).join('\n---\n');
      const { sceneDescription, image, choices } = await generateNextScene(storyContext, choice);
      const newScene: Scene = { text: sceneDescription, image };
      
      setGameState(prev => ({
        status: 'playing',
        history: [...prev.history, newScene],
        currentScene: newScene,
        choices,
        errorMessage: null,
      }));
    } catch (error) {
      console.error(error);
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
      setGameState(prev => ({ ...prev, status: 'error', errorMessage }));
    }
  }, [gameState.history]);
  
  const handleRestart = () => {
     setGameState({
        status: 'start',
        history: [],
        currentScene: null,
        choices: [],
        errorMessage: null,
     });
  };

  const renderContent = () => {
    switch (gameState.status) {
      case 'start':
        return <StartScreen onStart={handleStartGame} />;
      case 'playing':
      case 'loading':
        return (
          <GameScreen
            scene={gameState.currentScene}
            choices={gameState.choices}
            onChoice={handleChoice}
            isLoading={gameState.status === 'loading'}
            onRestart={handleRestart}
          />
        );
      case 'error':
        return <ErrorDisplay message={gameState.errorMessage} onRetry={handleRestart} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8 flex flex-col items-center">
      <header className="w-full max-w-5xl text-center mb-8">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 via-purple-400 to-pink-300 font-serif tracking-wide">
          Gemini Text Adventure
        </h1>
        <p className="text-gray-400 mt-3 text-lg">An AI-powered saga awaits.</p>
      </header>
      <main className="w-full max-w-5xl flex-grow flex items-center justify-center">
        {renderContent()}
      </main>
    </div>
  );
};

export default App;