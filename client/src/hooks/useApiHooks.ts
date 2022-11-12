import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useSocket } from "../util/promiseSocket";
import { IState } from "./syncStore";

type IJoinGame = {
  nickname: string;
  gameID: string;
};

export const useJoinGame = () => {
  const navigate = useNavigate();
  const { mutateAsync, isLoading } = useMutation(
    async (data: IJoinGame) => {
      return await useSocket.postMessage("join-game", {
        nickname: data.nickname,
        gameID: data.gameID,
      });
    },
    {
      onSuccess(p) {
        const payload = p as unknown as { data: IState["Game"] };
        if (payload.data._id) navigate(`/game/${payload.data._id}`);
      },
    }
  );

  return {
    joinGame: mutateAsync,
    joinLoading: isLoading,
  };
};

type ICreateGame = {
  nickname: string;
};

export const useCreateGame = () => {
  const navigate = useNavigate();
  const { mutateAsync, isLoading } = useMutation(
    async (data: ICreateGame) => {
      return await useSocket.postMessage("create-game", {
        nickname: data.nickname,
      });
    },
    {
      onSuccess(p) {
        const payload = p as unknown as { data: IState["Game"] };
        if (payload.data._id) navigate(`/game/${payload.data._id}`);
      },
    }
  );
  return {
    createGame: mutateAsync,
    createLoading: isLoading,
  };
};
