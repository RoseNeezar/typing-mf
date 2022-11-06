export type GameState = {
  _id: string;
  isOpen: boolean;
  players: string[];
  words: string[];
};
export interface IState {
  Game: GameState;
}

const createStore = <T>(initialState: T) => {
  let currentState = initialState;
  const listeners: Set<(data: T) => void> = new Set();
  return {
    getState: () => currentState,
    setState: <Q extends T>(newState: Q) => {
      currentState = newState;
      listeners.forEach((listener) => listener(currentState));
    },
    subscribe: (listener: () => void) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
  };
};

export const syncStore = createStore<IState>({
  Game: {
    _id: "",
    isOpen: false,
    players: [],
    words: [],
  },
});
