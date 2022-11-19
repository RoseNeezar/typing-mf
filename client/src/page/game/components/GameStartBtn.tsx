import React from "react";
import { IState, syncStore, TimerState } from "../../../hooks/syncStore";
import { useStartGame } from "../../../hooks/useApiHooks";
import { useStore } from "../../../hooks/useStore";

type Props = {
  player: IState["Game"]["players"][0];
  gameID: string;
};

const GameStartBtn = (props: Props) => {
  const data = useStore<TimerState>("TimerEvents", syncStore);
  const { startGame, loadingGame } = useStartGame();
  const handleStart = async () => {
    await startGame({
      playerID: props.player._id,
      gameID: props.gameID,
    });
  };

  return Object.keys(data).length === 0 ? (
    <button
      className={`m-auto mt-10 btn btn-primary w-fit ${
        loadingGame && "loading"
      }`}
      onClick={() => handleStart()}>
      Start Game
    </button>
  ) : null;
};

export default GameStartBtn;
