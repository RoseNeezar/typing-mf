import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import ModalPage from "../../components/ModalPage";
import { IState, syncStore } from "../../hooks/syncStore";
import { useStore } from "../../hooks/useStore";
import JoinGame from "../home/components/JoinGame";
import GameIDContainer from "./components/GameIDContainer";

type Props = {};

const Game = (props: Props) => {
  const pathname = useLocation();
  const data = useStore<IState["Game"]>("Game", syncStore);
  const [openUserModal, setOpenUserModal] = useState(false);

  useEffect(() => {
    if (data._id === "") {
      setOpenUserModal(true);
    }
  }, [data]);

  const findPlayer = React.useCallback(
    (socketID: any) => {
      return data?.players?.find((p) => p.socketID === socketID.id);
    },
    [data]
  );

  // if (!findPlayer(socket)) {
  //   return <Navigate to="/" replace />;
  // }

  // if (data.isOver) {
  //   return <Navigate to="/" replace />;
  // }

  return (
    <>
      <div className="">
        <div className="border mockup-window bg-base-300">
          <div className="flex justify-center px-4 py-16 bg-base-200">
            Hello!
          </div>
        </div>
      </div>
      <GameIDContainer id={data._id} />
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
