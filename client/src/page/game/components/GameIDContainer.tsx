import React, { FC } from "react";

type Props = {};

const copyUrlToClipboard = (path: string) => () => {
  navigator.clipboard.writeText(`${window.location.origin}${path}`);
};

const GameIDContainer: FC<{ id: string }> = ({ id }) => {
  return (
    <div
      onClick={copyUrlToClipboard(`/game/${id}`)}
      className="flex items-center p-3 m-4 bg-gray-600 border-2 border-gray-800 rounded-lg cursor-pointer">
      <div className="mr-3">Game ID: </div>
      <button className="p-3 bg-gray-700 rounded-lg">{id}</button>
    </div>
  );
};

export default GameIDContainer;
