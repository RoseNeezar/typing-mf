import { PlayerAttrs } from "../models/Player";

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
