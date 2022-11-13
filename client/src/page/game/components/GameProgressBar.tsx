import React, { FC, useCallback } from "react";
import { IState } from "../../../hooks/syncStore";
import GameKeyboard from "./GameKeyboard";

type Props = {
  player: IState["Game"]["players"][0];
  players: IState["Game"]["players"];
  wordsLength: number;
};

const ProgressBar: FC<{ percentage: number }> = ({ percentage }) => {
  return (
    <div
      className="border-4 radial-progress bg-primary text-primary-content border-primary"
      // @ts-ignore
      style={{ "--value": percentage }}>
      {percentage}%
    </div>
  );
};

const GameProgressBar = (props: Props) => {
  const calculatePercentage = useCallback(
    (player: Props["player"], wordsLength: Props["wordsLength"]) => {
      if (player.currentWordIndex !== 0) {
        return (player.currentWordIndex / wordsLength) * 100;
      }
      return 0;
    },
    []
  );

  return (
    <div className="flex flex-col w-full py-10">
      <div className="divider"></div>
      <div className="grid h-32 card bg-base-300 rounded-box place-items-center">
        <div className="flex items-center justify-between w-full px-4">
          <div className="w-24 font-bold">{props.player.nickname}</div>
          <GameKeyboard />
          <ProgressBar
            percentage={calculatePercentage(props.player, props.wordsLength)}
          />
        </div>
      </div>
      {props.players.map((p) => {
        const percentage = calculatePercentage(p, props.wordsLength);
        return (
          p._id !== props.player._id && (
            <div key={p._id}>
              <div className="divider"></div>
              <div className="grid h-32 card bg-base-300 rounded-box place-items-center">
                <div className="flex items-center justify-between w-full px-4">
                  <div className="w-24 font-bold">{p.nickname}</div>
                  <GameKeyboard />
                  <ProgressBar percentage={percentage} />
                </div>
              </div>
            </div>
          )
        );
      })}
    </div>
  );
};

export default GameProgressBar;
