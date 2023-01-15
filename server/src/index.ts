import mongoose from "mongoose";
import { createServer, socketServer } from "./server";

const port = process.env.PORT || 5011;

const start = async () => {
  try {
    await mongoose.connect("mongodb://root:example@typeracer-mongo:27017", {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
      useUnifiedTopology: true,
    });
    console.log("Connected to mongodb");
  } catch (err) {
    console.log(err);
  }

  const server = createServer().listen(port, () => {
    console.log(`api running on ${port}`);
  });

  socketServer(server);
};

start();
