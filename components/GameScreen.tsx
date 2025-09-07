import React from 'react';
import { Scene } from '../types';
import LoadingIndicator from './LoadingIndicator';

interface GameScreenProps {
  scene: Scene | null;
  choices: string[];
  onChoice: (choice: string) => void;
  isLoading: boolean;
  onRestart: () => void;
}

const GameScreen: React.FC<GameScreenProps> = ({ scene, choices, onChoice, isLoading, onRestart }) => {
  return (
    <div className="w-full h-full flex flex-col lg:flex-row gap-6 p-6 bg-black/30 backdrop-blur-lg rounded-2xl shadow-2xl border border-purple-900/50">
      {/* Image Column */}
      <div className="lg:w-1/2 w-full aspect-4/3 rounded-lg overflow-hidden relative bg-black/50 flex items-center justify-center ring-1 ring-inset ring-purple-500/30">
        {scene?.image ? (
          <img src={scene.image} alt="Adventure scene" className="w-full h-full object-cover transition-opacity duration-500 animate-fade-in" />
        ) : (
          <div className="text-gray-500">Conjuring visuals...</div>
        )}
        {isLoading && (
          <div className="absolute inset-0 bg-black/80 flex items-center justify-center backdrop-blur-sm">
            <LoadingIndicator />
          </div>
        )}
      </div>

      {/* Text and Choices Column */}
      <div className="lg:w-1/2 w-full flex flex-col">
        <div className="flex-grow bg-stone-200/95 p-4 rounded-lg overflow-y-auto h-64 lg:h-auto mb-4 custom-scrollbar shadow-inner">
          <p className="text-gray-900 font-serif leading-relaxed whitespace-pre-wrap">
            {scene?.text || 'The air shimmers as the world takes shape...'}
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {choices.map((choice, index) => (
            <button
              key={index}
              onClick={() => onChoice(choice)}
              disabled={isLoading}
              className="w-full text-left p-4 bg-slate-800 rounded-lg text-gray-200 border border-slate-700 hover:bg-slate-700 hover:border-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-wait disabled:hover:bg-slate-800 disabled:hover:border-slate-700"
            >
              {choice}
            </button>
          ))}
        </div>
        
        <div className="mt-4 pt-2 text-center">
            <button 
                onClick={onRestart}
                className="text-sm text-slate-400 hover:text-white hover:underline transition-colors decoration-dotted"
            >
                Begin a New Chronicle
            </button>
        </div>
      </div>
       <style>{`
          .custom-scrollbar::-webkit-scrollbar {
            width: 8px;
          }
          .custom-scrollbar::-webkit-scrollbar-track {
            background: transparent;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: #475569; /* slate-600 */
            border-radius: 4px;
            border: 2px solid #f5f5f4; /* stone-200 */
          }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: #334155; /* slate-700 */
          }
          @keyframes fade-in {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          .animate-fade-in {
            animation: fade-in 0.5s ease-in-out;
          }
        `}</style>
    </div>
  );
};

export default GameScreen;