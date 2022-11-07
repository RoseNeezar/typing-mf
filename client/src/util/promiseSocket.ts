import EventEmitter from "events";
import { v4 as uuidv4 } from "uuid";
import { io, Socket } from "socket.io-client";
import { IState, syncStore } from "../hooks/syncStore";

type CreateGame = {
  id: string;
  nickname: string;
};
export interface ServerOnEvents {
  "create-game": (data: IState & { id: string }) => void;
  "update-game": (data: IState) => void;
}
export interface ServerEmitEvents {
  "create-game": (data: { id: string }) => void;
  "update-game": (data: IState) => void;
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
      console.log("get new event: ", data);
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
