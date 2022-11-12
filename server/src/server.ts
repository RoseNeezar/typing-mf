import { json, urlencoded } from "body-parser";
import express, { Express } from "express";
import morgan from "morgan";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
import { getQuotesData } from "./service/Quotable";
import { Game, GameDoc } from "./models/Game";
import { PlayerInit } from "./models/Player";

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
export interface ServerOnEvents {
  "create-game": (data: CreateGame) => void;
  "update-game": (data: GameDoc) => void;
  "join-game": (data: JoinGame) => void;
}
export interface ServerEmitEvents {
  "create-game": (data: EmitData) => void;
  "update-game": (data: GameDoc) => void;
  "join-game": (data: EmitData) => void;
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

  ///6367c44c79d875783a4de3ed
  io.on("connect", (socket) => {
    socket.on("create-game", async (data) => {
      try {
        const quotableData = await getQuotesData();
        console.log("What-", data);
        let player: PlayerInit = {
          socketID: socket.id,
          isPartyLeader: true,
          nickname: data.nickname,
        };

        let game = new Game();

        game.words = quotableData;

        game.players.push(player);

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

        if (game.players.find((x) => x.nickname === data.nickname)) {
          const gameID = game._id.toString();
          socket.join(gameID);
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

          game.players.push(player as PlayerInit);

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
  });
};
