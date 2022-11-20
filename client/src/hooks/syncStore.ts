import { KeyInput } from "../util/promiseSocket";

export type IPlayer = {
  WPM: number;
  currentWordIndex: number;
  isPartyLeader: boolean;
  nickname: string;
  socketID: string;
  _id: string;
};
export type GameState = {
  _id: string;
  isOpen: boolean;
  isOver: boolean;
  players: IPlayer[];
  words: string[];
};

export type TimerState = {
  countDown: string;
  msg: string;
};
export interface IState {
  Game: GameState;
  KeyEvents: KeyInput[];
  TimerEvents: TimerState | {};
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
    isOver: false,
    players: [],
    words: [],
  },
  KeyEvents: [],
  TimerEvents: {},
});

export const ResetStore: IState = {
  Game: {
    _id: "",
    isOpen: false,
    isOver: false,
    players: [],
    words: [],
  },
  KeyEvents: [],
  TimerEvents: {},
};
