import { Server } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { Game } from "../models/Game";
import { PlayerAttrs } from "../models/Player";
import { ServerOnEvents, ServerEmitEvents } from "../server";

export const calculateWPM = (
  endTime: number,
  startTime: number,
  player: PlayerAttrs
) => {
  let numOfWords = player.currentWordIndex;
  const timeInSeconds = (endTime - startTime) / 1000;
  const timeInMinutes = timeInSeconds / 60;
  const WPM = Math.floor(numOfWords / timeInMinutes);
  return WPM;
};

export const calculateTime = (time: number) => {
  let minutes = Math.floor(time / 60);
  let seconds = time % 60;
  return `${minutes}:${seconds < 10 ? "0" + seconds : seconds}`;
};

export const delay = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

export const TimerID = (() => {
  let timerID: unknown = "";
  const setTimerID = (data: NodeJS.Timeout) => {
    timerID = data;
  };
  const getTimerID = () => {
    return timerID;
  };
  return {
    getTimerID,
    setTimerID,
  };
})();

export const startGameClock = async (
  id: string,
  gameID: string,
  io: Server<ServerOnEvents, ServerEmitEvents, DefaultEventsMap, any>
) => {
  let game = await Game.findById(gameID);
  if (!game) return;
  game.startTime = new Date().getTime();

  game = await game.save();

  let time = 120;

  const startTimer = async () => {
    if (time >= 0 && !game?.isOver) {
      const formatTime = calculateTime(time);
      io.to(gameID).emit("timer-start", {
        id,
        data: {
          countDown: formatTime,
          msg: "Time Remaining",
        },
      });
      time--;
    } else {
      // get time stamp of when the game ended
      let endTime = new Date().getTime();
      // find the game
      let game = await Game.findById(gameID);
      if (!game) return;
      // get the game start time
      let { startTime } = game!;
      // game is officially over
      game.isOver = true;
      // calculate all players WPM who haven't finished typing out sentence
      game.players.forEach((player, index) => {
        if (player.WPM === -1)
          game!.players[index].WPM = calculateWPM(endTime, startTime, player);
      });
      // save the game
      game = await game.save();
      // send updated game to all sockets within game
      io.to(gameID).emit("update-game", game);
      clearInterval(timerID);
    }
  };
  startTimer();
  let timerID = setInterval(() => startTimer(), 1000);
  TimerID.setTimerID(timerID);
};
