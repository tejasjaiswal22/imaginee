
export interface Scene {
  text: string;
  image: string;
}

export interface GameState {
  status: 'start' | 'loading' | 'playing' | 'error';
  history: Scene[];
  currentScene: Scene | null;
  choices: string[];
  errorMessage: string | null;
}
