import { FC, useMemo } from "react";
import { IState } from "../../../hooks/syncStore";

type Props = {
  words: Array<string>;
  player: IState["Game"]["players"][0];
};

const WordTyped: FC<Props> = ({ words, player }) => {
  const currentWords = useMemo(
    () => words.slice(0, player.currentWordIndex).join(" "),
    [words, player]
  );

  return <span className="font-semibold text-green-600">{currentWords}</span>;
};
const WordLeft: FC<Props> = ({ words, player }) => {
  const wordsToBeTyped = useMemo(
    () => words.slice(player.currentWordIndex + 1, words.length).join(" "),
    [words, player]
  );

  return <span className="">{wordsToBeTyped}</span>;
};

const CurrentWord: FC<Props> = ({ words, player }) => {
  return (
    <span className="mx-2 font-bold underline">
      {words[player.currentWordIndex]}
    </span>
  );
};

const GameDisplayWords = (props: Props) => {
  return (
    <div className="flex justify-center p-5 my-6 text-center ">
      <div className="p-4 bg-gray-700 rounded-2xl">
        <WordTyped {...props} />
        <CurrentWord {...props} />
        <WordLeft {...props} />
      </div>
    </div>
  );
};

export default GameDisplayWords;
