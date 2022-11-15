import { json, urlencoded } from "body-parser";
import express, { Express } from "express";
import morgan from "morgan";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
import { getQuotesData } from "./service/Quotable";
import { Game, GameDoc } from "./models/Game";
import { PlayerAttrs, PlayerInit } from "./models/Player";
import { calculateWPM, delay } from "./service/utils";

type EmitData = {
  id: string;
  data: GameDoc | null | {};
};
type CreateGame = {
  id: string;
  nickname: string;
};

type JoinGame = {
  id: string;
  gameID: string;
  nickname: string;
};

type UserInput = {
  id: string;
  userInput: string;
  gameID: string;
};

type KeyInput = {
  id: string;
  nickname: string;
  key: string;
  gameID: string;
};

export interface ServerOnEvents {
  "create-game": (data: CreateGame) => void;
  "update-game": (data: GameDoc) => void;
  "join-game": (data: JoinGame) => void;
  "user-input": (data: UserInput) => void;
  "key-pressed": (data: KeyInput) => void;
  "remove-key-pressed": (data: KeyInput) => void;
}
export interface ServerEmitEvents {
  "create-game": (data: EmitData) => void;
  "update-game": (data: GameDoc) => void;
  "join-game": (data: EmitData) => void;
  "user-input": (data: EmitData) => void;
  "key-pressed": (data: any) => void;
  "remove-key-pressed": (data: any) => void;
  timer: (data: any) => void;
  done: () => void;
}

export const createServer = (): Express => {
  const app = express();
  app
    .disable("x-powered-by")
    .use(morgan("dev"))
    .use(urlencoded({ extended: true }))
    .use(json())
    .use(cors())
    .get("/message/:name", (req, res) => {
      return res.json({ message: `hello ${req.params.name}` });
    })
    .get("/healthz", (req, res) => {
      return res.json({ ok: true });
    });

  return app;
};

export const socketServer = (server: http.Server) => {
  const io = new Server<ServerOnEvents, ServerEmitEvents>(server, {
    cors: {
      origin: "*",
    },
  });

  //socket.emit - emit to socket client only (single user thats connected/listening)
  //io.emit - emit to all connected socket client (multiple user that connected/listening)

  io.on("connect", (socket) => {
    socket.on("create-game", async (data) => {
      try {
        const quotableData = await getQuotesData();
        console.log("What-", data);
        let player: Partial<PlayerAttrs> = {
          socketID: socket.id,
          isPartyLeader: true,
          nickname: data.nickname,
        };

        let game = new Game();

        game.words = quotableData;

        game.players.push(player as PlayerAttrs);

        game = await game.save();

        const gameId = game._id.toString();
        socket.join(gameId);

        io.to(gameId).emit("update-game", game);
        socket.emit("create-game", { id: data.id, data: game });
      } catch (err) {
        console.log(err);
      }
    });
    socket.on("join-game", async (data) => {
      try {
        let game = await Game.findById(data.gameID);

        if (!game) {
          socket.emit("join-game", {
            id: data.id,
            data: null,
          });

          return null;
        }
        const checkIfPlayerExist = game.players.find(
          (x) => x.nickname === data.nickname
        );
        if (checkIfPlayerExist) {
          const gameID = game._id.toString();
          socket.join(gameID);

          checkIfPlayerExist.socketID = socket.id;

          const foundIndex = game.players.findIndex(
            (x) => x.nickname === data.nickname
          );
          game.players[foundIndex] = checkIfPlayerExist;
          game = await game.save();

          io.to(gameID).emit("update-game", game);
          socket.emit("join-game", {
            id: data.id,
            data: {
              error: "duplicate nickname",
            },
          });
          return null;
        }

        if (game?.isOpen) {
          const gameID = game._id.toString();
          socket.join(gameID);

          let player: Partial<PlayerInit> = {
            socketID: socket.id,
            nickname: data.nickname,
          };

          game.players.push(player as PlayerAttrs);

          game = await game.save();

          io.to(gameID).emit("update-game", game);
          socket.emit("join-game", {
            id: data.id,
            data: game,
          });
        }
      } catch (error) {
        console.log(error);
      }
    });

    socket.on("user-input", async (data) => {
      try {
        let game = await Game.findById(data.gameID);

        if ((game?.isOpen && game?.isOver) || !game) {
          socket.emit("user-input", {
            id: data.id,
            data: game,
          });
          return null;
        }

        let player = game?.players.find((x) => x.socketID === socket.id);

        if (!player) return;

        let word = game?.words[player!.currentWordIndex];

        if (word === data.userInput) {
          player.currentWordIndex++;

          if (player.currentWordIndex !== game?.words.length) {
            game = await game.save();
            socket.emit("user-input", {
              id: data.id,
              data: game,
            });
            io.to(data.gameID).emit("update-game", game);
          } else {
            let endTime = new Date().getTime();
            let { startTime } = game;

            player.WPM = calculateWPM(endTime, startTime, player);
            game = await game.save();
            socket.emit("user-input", {
              id: data.id,
              data: game,
            });
            socket.emit("done");

            io.to(data.gameID).emit("update-game", game);
          }
        }
        socket.emit("user-input", {
          id: data.id,
          data: game,
        });
      } catch (error) {
        console.log("err-", error);
      }
    });

    socket.on("key-pressed", async (data) => {
      io.to(data.gameID).emit("key-pressed", {
        id: data.id,
        data,
      });
    });

    socket.on("remove-key-pressed", async (data) => {
      io.to(data.gameID).emit("remove-key-pressed", {
        id: data.id,
        data,
      });
    });
  });
};
