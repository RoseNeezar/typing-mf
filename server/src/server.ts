import { json, urlencoded } from "body-parser";
import express, { Express } from "express";
import morgan from "morgan";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
import { getQuotesData } from "./service/Quotable";
import { Game, GameDoc } from "./models/Game";
import { PlayerInit } from "./models/Player";

type CreateGame = {
  id: string;
  nickname: string;
};
export interface ServerOnEvents {
  "create-game": (data: CreateGame) => void;
  "update-game": (data: GameDoc) => void;
}
export interface ServerEmitEvents {
  "create-game": (data: { id: string; data: GameDoc }) => void;
  "update-game": (data: GameDoc) => void;
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
        io.emit("create-game", { id: data.id, data: game });
      } catch (err) {
        console.log(err);
      }
    });
  });
};
