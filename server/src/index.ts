import mongoose from "mongoose";
import { createServer, socketServer } from "./server";

const port = process.env.PORT || 5001;

const start = async () => {
  try {
    await mongoose.connect("mongodb://root:example@localhost:27017");
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
