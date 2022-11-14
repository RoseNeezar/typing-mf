import React, { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import ModalPage from "../../components/ModalPage";
import { IState, syncStore } from "../../hooks/syncStore";
import { useStore } from "../../hooks/useStore";
import { socket } from "../../util/promiseSocket";
import JoinGame from "../home/components/JoinGame";
import GameDisplayWords from "./components/GameDisplayWords";
import GameIDContainer from "./components/GameIDContainer";
import GameInput from "./components/GameInput";
import GameProgressBar from "./components/GameProgressBar";

type Props = {};

const Game = (props: Props) => {
  const pathname = useLocation();
  const data = useStore<IState["Game"]>("Game", syncStore);
  const [openUserModal, setOpenUserModal] = useState(false);

  const findPlayer = React.useCallback(
    (socketID: typeof socket) => {
      return data?.players?.find((p) => p.socketID === socketID.id);
    },
    [data]
  );

  useEffect(() => {
    if (data._id === "" || !findPlayer(socket)) {
      setOpenUserModal(true);
    }
  }, [data, findPlayer]);

  if (data.isOver) {
    return <Navigate to="/" replace />;
  }

  return (
    <>
      <div className="m-4">
        <div className="border mockup-window bg-base-300">
          <div className="flex flex-col min-h-16">
            <div className="flex flex-row p-3 mx-3 rounded-lg bg-primary w-fit h-fit">
              <div className="mr-3 font-bold">Name:</div>
              <div className="font-semibold">
                {findPlayer(socket)?.nickname ?? "Who ?"}
              </div>
            </div>
            {findPlayer(socket) && (
              <>
                <GameDisplayWords
                  player={findPlayer(socket)!}
                  words={data.words}
                />
                <GameInput
                  nickname={findPlayer(socket)!.nickname}
                  gameID={data._id}
                  isOpen={data.isOpen}
                  isOver={data.isOver}
                />
                <GameProgressBar
                  player={findPlayer(socket)!}
                  players={data.players}
                  wordsLength={data.words.length}
                />
              </>
            )}
          </div>
        </div>
      </div>
      {data.isOpen && <GameIDContainer id={data._id} />}
      <ModalPage
        backPath=""
        body={
          <JoinGame
            gameID={pathname.pathname.split("/")[2]}
            closeModal={setOpenUserModal}
          />
        }
        isPage={false}
        renderPath=""
        onClose={setOpenUserModal}
        show={openUserModal}
      />
    </>
  );
};

export default Game;
