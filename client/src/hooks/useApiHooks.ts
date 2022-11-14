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

type IUserInput = {
  userInput: string;
  gameID: string;
};

export const useUserInput = () => {
  const { mutateAsync, isLoading } = useMutation(async (data: IUserInput) => {
    return await useSocket.postMessage("user-input", {
      userInput: data.userInput,
      gameID: data.gameID,
    });
  });
  return {
    userInput: mutateAsync,
    loadingInput: isLoading,
  };
};

type IKeyInput = {
  nickname: string;
  key: string;
  gameID: string;
};

export const useKeyInput = (key: "key-pressed" | "remove-key-pressed") => {
  const { mutateAsync, isLoading } = useMutation(async (data: IKeyInput) => {
    return await useSocket.postMessage(key, {
      nickname: data.nickname,
      key: data.key,
      gameID: data.gameID,
    });
  });
  return {
    KeyInput: mutateAsync,
    loadingInput: isLoading,
  };
};