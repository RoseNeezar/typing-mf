import mongoose from "mongoose";
import { Player, PlayerAttrs, PlayerInit, PlayerSchema } from "./Player";

export interface GameAttrs {
  words: string[];
  isOpen: boolean;
  isOver: boolean;
  players: PlayerAttrs[];
  startTime: number;
}

export interface GameDoc extends mongoose.Document, GameAttrs {}

interface GameModel extends mongoose.Model<GameDoc> {
  build(attr: GameAttrs): GameDoc;
}

const GameSchema = new mongoose.Schema<GameAttrs>({
  words: [
    {
      type: String,
    },
  ],
  isOpen: {
    type: Boolean,
    default: true,
  },
  isOver: {
    type: Boolean,
    default: false,
  },
  players: [PlayerSchema],
  startTime: {
    type: Number,
  },
});

GameSchema.statics.build = (attr: GameAttrs) => {
  return new Game(attr);
};

const Game = mongoose.model<GameDoc, GameModel>("Game", GameSchema);

export { Game };
