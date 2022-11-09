import React from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { IState, syncStore } from "../../hooks/syncStore";
import { useStore } from "../../hooks/useStore";
import { socket } from "../../util/promiseSocket";

type Props = {};

const Game = (props: Props) => {
  const data = useStore<IState["Game"]>("Game", syncStore);

  const findPlayer = React.useCallback(
    (socketID: any) => {
      return data?.players?.find((p) => p.socketID === socketID.id);
    },
    [data]
  );

  if (!findPlayer(socket)) {
    return <Navigate to="/" replace />;
  }

  return <div>Game</div>;
};

export default Game;
