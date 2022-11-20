import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { IState } from "../../../hooks/syncStore";

type Props = {
  players: IState["Game"]["players"];
};

const GameScore = (props: Props) => {
  const navigate = useNavigate();
  const scoreBoard = useMemo(() => {
    const scoreBoard = props.players.filter((player) => player.WPM !== -1);
    return scoreBoard.sort((a, b) =>
      a.WPM > b.WPM ? -1 : b.WPM > a.WPM ? 1 : 0
    );
  }, [props.players]);

  if (scoreBoard.length === 0) return null;
  return (
    <div className="flex flex-col justify-center">
      <div className="p-1 m-5 overflow-x-auto border-2 rounded-lg border-primary">
        <table className="table w-full">
          <thead>
            <tr>
              <th></th>
              <th>Name</th>
              <th>WPM</th>
            </tr>
          </thead>
          <tbody>
            {scoreBoard.map((player, index) => {
              return (
                <tr key={index}>
                  <th scope="row">{index + 1}</th>
                  <td>{player.nickname}</td>
                  <td>{player.WPM}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <button
        onClick={() => navigate("/")}
        className="m-auto btn btn-secondary">
        Back
      </button>
    </div>
  );
};

export default GameScore;
