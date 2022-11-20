import { json, urlencoded } from "body-parser";
import express, { Express } from "express";
import morgan from "morgan";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
import { getQuotesData } from "./service/Quotable";
import { Game, GameDoc } from "./models/Game";
import { PlayerAttrs, PlayerInit } from "./models/Player";
import { calculateWPM, startGameClock, TimerID } from "./service/utils";

type EmitData = {
  id: string;
  data: GameDoc | KeyInput | null | {};
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

type TimerStart = {
  id: string;
  gameID: string;
  playerID: string;
};

type CheckGame = {
  id: string;
  gameID: string;
};

export interface ServerOnEvents {
  "create-game": (data: CreateGame) => void;
  "update-game": (data: GameDoc) => void;
  "join-game": (data: JoinGame) => void;
  "user-input": (data: UserInput) => void;
  "key-pressed": (data: KeyInput) => void;
  "remove-key-pressed": (data: KeyInput) => void;
  "timer-start": (data: TimerStart) => void;
  "check-game": (data: CheckGame) => void;
}
export interface ServerEmitEvents {
  "create-game": (data: EmitData) => void;
  "update-game": (data: GameDoc) => void;
  "join-game": (data: EmitData) => void;
  "user-input": (data: EmitData) => void;
  "key-pressed": (data: EmitData) => void;
  "remove-key-pressed": (data: EmitData) => void;
  "timer-start": (data: EmitData) => void;
  "game-end": () => void;
  "check-game": (data: EmitData) => void;
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

            const gameStatus = game.players
              .map((x) => x.WPM)
              .filter((x) => x === -1);

            if (gameStatus.length === 0) {
              clearInterval(TimerID.getTimerID() as NodeJS.Timeout);
              game.isOver = true;
              game = await game.save();
            }

            socket.emit("game-end");

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

    socket.on("timer-start", async (data) => {
      socket.emit("timer-start", {
        id: data.id,
        data: {},
      });

      let countDown = 5;

      let game = await Game.findById(data.gameID);

      if (!game) {
        return;
      }
      let player = game.players.find(
        (x) => x._id!.toString() === data.playerID
      );

      if (player && player.isPartyLeader && !game.isOver) {
        let timerID = setInterval(async () => {
          if (countDown >= 0) {
            // emit countDown to all players within game
            io.to(data.gameID).emit("timer-start", {
              id: data.id,
              data: {
                countDown,
                msg: "Starting Game",
              },
            });
            countDown--;
          }
          // start time clock over, now time to start game
          else {
            // close game so no one else can join
            game!.isOpen = false;
            // save the game
            game = await game!.save();
            // send updated game to all sockets within game
            io.to(data.gameID).emit("update-game", game);
            // start game clock
            startGameClock(data.id, data.gameID, io);
            clearInterval(timerID);
          }
        }, 1000);
      }
    });

    socket.on("check-game", async (data) => {
      let game = await Game.findById(data.gameID);

      if (!game) {
        socket.emit("check-game", {
          id: data.id,
          data: false,
        });
      }
      if (game?.isOver) {
        socket.emit("check-game", {
          id: data.id,
          data: false,
        });
      }
      socket.emit("check-game", {
        id: data.id,
        data: true,
      });
    });
  });
};
