import React, { useEffect, useRef, useState } from "react";
import { useUserInput } from "../../../hooks/useApiHooks";

type Props = {
  isOpen: boolean;
  isOver: boolean;
  gameID: string;
};

const GameInput = (props: Props) => {
  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const { userInput } = useUserInput();

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
