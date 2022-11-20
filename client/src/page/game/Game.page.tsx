import React, { useEffect, useMemo, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import ModalPage from "../../components/ModalPage";
import { IState, syncStore } from "../../hooks/syncStore";
import { useCheckGame } from "../../hooks/useApiHooks";
import { useStore } from "../../hooks/useStore";
import { socket } from "../../util/promiseSocket";
import JoinGame from "../home/components/JoinGame";
import GameCountdown from "./components/GameCountdown";
import GameDisplayWords from "./components/GameDisplayWords";
import GameIDContainer from "./components/GameIDContainer";
import GameInput from "./components/GameInput";
import GameProgressBar from "./components/GameProgressBar";
import GameScore from "./components/GameScore";
import GameStartBtn from "./components/GameStartBtn";

type Props = {};

const Game = (props: Props) => {
  const pathname = useLocation();
  const gameID = useMemo(() => pathname.pathname.split("/")[2], [pathname]);
  const data = useStore<IState["Game"]>("Game", syncStore);
  const [openUserModal, setOpenUserModal] = useState(false);

  const { checkGame, loadingCheckGame } = useCheckGame(gameID);

  const currentPlayer = useMemo(
    () => data?.players?.find((p) => p.socketID === socket.id),
    [data]
  );

  useEffect(() => {
    if (data._id === "" || !currentPlayer) {
      setOpenUserModal(true);
    }
  }, [data, currentPlayer]);

  if (loadingCheckGame) {
    return <div className="loading"></div>;
  }

  if (!checkGame) {
    return <Navigate to="/" replace />;
  }

  return (
    <>
      <div className="m-4">
        <div className="py-8 border mockup-window bg-base-300">
          <div className="flex flex-col min-h-16">
            <div className="relative flex items-center justify-center mb-10">
              <div className="absolute top-0 left-0 flex flex-row p-3 mx-3 rounded-lg bg-primary w-fit h-fit">
                <div className="mr-3 font-bold">Name:</div>
                <div className="font-semibold">
                  {currentPlayer?.nickname ?? "Who ?"}
                </div>
              </div>
              {data.isOpen && <GameIDContainer id={data._id} />}
            </div>
            {currentPlayer && (
              <>
                <GameDisplayWords player={currentPlayer!} words={data.words} />
                <GameInput
                  nickname={currentPlayer!.nickname}
                  gameID={data._id}
                  isOpen={data.isOpen}
                  isOver={data.isOver}
                />
                <GameCountdown />
                {data.isOpen && currentPlayer?.isPartyLeader && (
                  <GameStartBtn gameID={gameID} player={currentPlayer!} />
                )}
                {currentPlayer.WPM === -1 && (
                  <GameProgressBar
                    player={currentPlayer!}
                    players={data.players}
                    wordsLength={data.words.length}
                  />
                )}
              </>
            )}
          </div>
        </div>
      </div>
      <div className="">
        <GameScore players={data?.players} />
      </div>
      <ModalPage
        backPath=""
        body={<JoinGame gameID={gameID} closeModal={setOpenUserModal} />}
        isPage={false}
        renderPath=""
        onClose={setOpenUserModal}
        show={openUserModal}
      />
    </>
  );
};

export default Game;
