import React, { useEffect, useRef, useState } from "react";
import { useKeyInput, useUserInput } from "../../../hooks/useApiHooks";

type Props = {
  isOpen: boolean;
  isOver: boolean;
  gameID: string;
  nickname: string;
};

const GameInput = (props: Props) => {
  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const { userInput } = useUserInput();
  const { KeyInput: onKey } = useKeyInput("key-pressed");
  const { KeyInput: offKey } = useKeyInput("remove-key-pressed");

  const handleInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;

    let lastChar = value.charAt(value.length - 1);

    if (lastChar === " ") {
      await userInput({
        userInput: input,
        gameID: props.gameID,
      });
      setInput("");
    } else {
      setInput(e.target.value);
    }
  };

  const handleKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.code.substring(0, 3) !== "Key") return;
    const key = e.code.charAt(e.code.length - 1).toLocaleLowerCase();

    await onKey({
      gameID: props.gameID,
      key,
      nickname: props.nickname,
    });
  };

  const handleKeyUp = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.code.substring(0, 3) !== "Key") return;
    const key = e.code.charAt(e.code.length - 1).toLocaleLowerCase();

    await offKey({
      gameID: props.gameID,
      key,
      nickname: props.nickname,
    });
  };

  useEffect(() => {
    if (!props.isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [props.isOpen]);

  return (
    <div className="mt-5 text-center">
      <input
        type="text"
        // readOnly={props.isOpen || props.isOver}
        onKeyDown={handleKeyDown}
        onKeyUp={handleKeyUp}
        onChange={handleInput}
        value={input}
        ref={inputRef}
        placeholder="Type here"
        className="w-full max-w-xs input input-bordered input-primary"
      />
    </div>
  );
};

export default GameInput;
