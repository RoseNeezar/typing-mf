import EventEmitter from "events";
import { v4 as uuidv4 } from "uuid";
import { io } from "socket.io-client";

export const socket = io("http://localhost:5001");

export class SocketClient {
  private emitter: EventEmitter;

  constructor() {
    this.emitter = new EventEmitter();

    this.subscribeMessages();
  }

  private subscribeMessages() {
    socket.onAny((type, data) => {
      // if (type === BinanceResponseType.Error) {
      //   return this.emitter.emit(data.id, null, data);
      // }
      this.emitter.emit(data.id, data, null);
    });
  }

  async postMessage(event: string, data: any, timeout = 3000) {
    const res = new Promise((resolve, reject) => {
      const id = uuidv4();

      socket.emit(event, { ...data, id });

      this.emitter.once(id, (data: any, err: unknown) => {
        if (err) {
          return reject(err);
        }
        resolve(data);
      });

      setTimeout(() => {
        return reject();
      }, timeout);
    });

    return res;
  }
}
