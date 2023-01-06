import React, { useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import ModalPage from "../../components/ModalPage";
import CreateGame from "./components/CreateGame";
import JoinGame from "./components/JoinGame";
import { Modal } from "../../components/Modal";

type Props = {};

const Home = (props: Props) => {
  const location = useLocation();
  const [openModal, setOpenModal] = useState({
    openCreateGame: false,
    openJoinGame: false,
  });
  return (
    <div className="flex items-center justify-center h-screen bg-cyan-800">
      <div className="min-h-screen hero bg-base-200">
        <div className="text-center hero-content">
          <div className="max-w-md">
            <h1 className="text-5xl font-bold">Typing Game what</h1>
            <p className="py-6">Test you typing speed ! okoko</p>
            <div
              className="btn-primary btn mr-3"
              onClick={() =>
                setOpenModal({ ...openModal, openCreateGame: true })
              }
            >
              Create Game
            </div>

            <div
              className="btn-secondary btn"
              onClick={() => setOpenModal({ ...openModal, openJoinGame: true })}
            >
              Join Game
            </div>
          </div>
        </div>
      </div>

      <Modal
        open={openModal.openCreateGame}
        onClose={() => setOpenModal({ ...openModal, openCreateGame: false })}
      >
        <CreateGame />
      </Modal>
      <Modal
        open={openModal.openJoinGame}
        onClose={() => setOpenModal({ ...openModal, openJoinGame: false })}
      >
        <JoinGame />
      </Modal>
    </div>
  );
};

export default Home;
