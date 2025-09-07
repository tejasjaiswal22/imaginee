import React, { useState } from 'react';

interface StartScreenProps {
  onStart: (prompt: string) => void;
}

const adventureStarters = [
  "A forgotten temple deep in the jungle",
  "A cyberpunk city under acid rain",
  "A haunted Victorian mansion",
  "A derelict spaceship drifting in the void",
  "A mystical forest where animals talk",
];

const StartScreen: React.FC<StartScreenProps> = ({ onStart }) => {
  const [prompt, setPrompt] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim()) {
      onStart(prompt.trim());
    }
  };

  const handleStarterClick = (starter: string) => {
    setPrompt(starter);
    onStart(starter);
  }

  return (
    <div className="w-full max-w-2xl text-center bg-black/30 backdrop-blur-lg p-8 rounded-2xl shadow-2xl border border-purple-900/50 transition-all duration-500">
      <h2 className="text-3xl font-bold text-white mb-4 font-serif">Weave Your Tale</h2>
      <p className="text-gray-400 mb-6">Describe the world you wish to enter. A single sentence is all it takes to spark a universe.</p>
      
      <form onSubmit={handleSubmit}>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="w-full h-28 p-4 bg-slate-900/70 border border-slate-700 rounded-lg text-lg text-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 focus:bg-slate-900 transition-all duration-300 resize-none placeholder:text-gray-500"
          placeholder="e.g., A lone knight guards a bridge to a realm of clouds..."
        />
        <button 
          type="submit"
          disabled={!prompt.trim()}
          className="mt-6 w-full py-4 px-6 bg-gradient-to-br from-purple-600 to-blue-600 text-white font-bold text-xl rounded-lg shadow-lg hover:shadow-purple-500/50 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100 disabled:shadow-none transition-all duration-300"
        >
          Begin Adventure
        </button>
      </form>

      <div className="mt-8">
        <p className="text-gray-500 mb-4 text-sm">Or choose a fate...</p>
        <div className="flex flex-wrap gap-3 justify-center">
          {adventureStarters.map((starter) => (
            <button
              key={starter}
              onClick={() => handleStarterClick(starter)}
              className="px-4 py-2 bg-slate-800/80 border border-slate-700 text-gray-300 rounded-lg text-sm hover:bg-purple-800/50 hover:border-purple-600 hover:text-white transition-colors duration-200"
            >
              {starter}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StartScreen;