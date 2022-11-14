import EventEmitter from "events";
import { v4 as uuidv4 } from "uuid";
import { io, Socket } from "socket.io-client";
import { IState, syncStore } from "../hooks/syncStore";

type JoinGame = {
  id: string;
  gameID: string;
  nickname: string;
};

type UserInput = {
  userInput: string;
  gameID: string;
};
export type KeyInput = {
  nickname: string;
  key: string;
  gameID: string;
};

export interface ServerOnEvents {
  "create-game": (data: IState & { id: string }) => void;
  "update-game": (data: IState) => void;
  "join-game": (data: JoinGame) => void;
  "user-input": (data: IState & { id: string }) => void;
  "key-pressed": (data: { data: KeyInput } & { id: string }) => void;
  "remove-key-pressed": (data: { data: KeyInput } & { id: string }) => void;
}
export interface ServerEmitEvents {
  "create-game": (data: { id: string }) => void;
  "update-game": (data: IState) => void;
  "join-game": (data: Omit<JoinGame, "id">) => void;
  "user-input": (data: UserInput) => void;
  "key-pressed": (data: KeyInput & { id: string }) => void;
  "remove-key-pressed": (data: KeyInput & { id: string }) => void;
}

export const socket: Socket<ServerOnEvents, ServerEmitEvents> = io(
  "http://localhost:5001"
);

export class SocketClient {
  private emitter: EventEmitter;

  constructor() {
    this.emitter = new EventEmitter();

    this.subscribeMessages();
  }

  private subscribeMessages() {
    socket.on("create-game", (data) => {
      console.log("create game event: ", data);
      this.emitter.emit(data?.id, data, null);
    });
    socket.on("update-game", (data) => {
      syncStore.setState({
        ...syncStore.getState(),
        Game: {
          ...syncStore.getState().Game,
          ...data,
        },
      });
    });
    socket.on("join-game", (data) => {
      console.log("join game event: ", data);
      this.emitter.emit(data?.id, data, null);
    });
    socket.on("user-input", (data) => {
      console.log("user input event: ", data);

      this.emitter.emit(data?.id, data, null);
    });
    socket.on("key-pressed", (data) => {
      let newEvent = syncStore.getState().KeyEvents;
      newEvent.push(data.data);

      syncStore.setState({
        ...syncStore.getState(),
        KeyEvents: [...syncStore.getState().KeyEvents, data.data],
      });

      this.emitter.emit(data?.id, data, null);
    });
    socket.on("remove-key-pressed", (data) => {
      let removeIndex = syncStore
        .getState()
        .KeyEvents.findIndex((t) => t.nickname === data.data.nickname);

      if (removeIndex > -1) {
        let tmp = syncStore.getState().KeyEvents;

        tmp.splice(removeIndex, 1);

        syncStore.setState({
          ...syncStore.getState(),
          KeyEvents: syncStore
            .getState()
            .KeyEvents.filter(
              (x) =>
                x.nickname !== data.data.nickname && x.key !== data.data.key
            ),
        });
      }
      this.emitter.emit(data?.id, data, null);
    });
    return () => socket.removeAllListeners();
  }

  async postMessage<T>(
    event: keyof ServerEmitEvents,
    data: T,
    timeout = 3000
  ): Promise<T> {
    const res = new Promise<T>((resolve, reject) => {
      const id = uuidv4();

      socket.emit(event, { ...data, id });

      this.emitter.once(id, (data: object, err: unknown) => {
        if (err) {
          return reject(err);
        }
        resolve(data as T);
      });

      setTimeout(() => {
        return reject();
      }, timeout);
    });

    return res;
  }
}

export const useSocket = new SocketClient();
