import mongoose from "mongoose";

export interface PlayerAttrs {
  currentWordIndex: number;
  socketID: string;
  isPartyLeader: boolean;
  WPM: number;
  nickname: string;
}

export type PlayerInit = Pick<
  PlayerAttrs,
  "socketID" | "isPartyLeader" | "nickname"
>;

export interface PlayerDoc extends mongoose.Document, PlayerAttrs {}

interface PlayerModel extends mongoose.Model<PlayerDoc> {
  build(attr: PlayerAttrs): PlayerDoc;
}

export const PlayerSchema = new mongoose.Schema<PlayerAttrs>({
  currentWordIndex: {
    type: Number,
    default: 0,
  },
  socketID: {
    type: String,
  },
  isPartyLeader: {
    type: Boolean,
    default: false,
  },
  nickname: {
    type: String,
  },
  WPM: {
    type: Number,
    default: -1,
  },
});

PlayerSchema.statics.build = (attr: PlayerAttrs) => {
  return new Player(attr);
};

const Player = mongoose.model<PlayerDoc, PlayerModel>("Player", PlayerSchema);

export { Player };
