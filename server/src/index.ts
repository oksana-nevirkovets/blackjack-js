import express from "express";
import http from "http";
import cors from "cors";
import mongoose from "mongoose";
import session from "express-session";
import { Server } from "ws";
import MongoStore from "connect-mongo";
import Game from "./models/game";
import { WebSocketWithSessionData } from "./types/websocket";
import { gameController } from "./controllers/gameController";

const PORT = process.env.PORT || 3000;
const MONGODB_URI =
  "mongodb+srv://oksananevirkovets:J9efA5AQ13ASZqwG@blackjack.0pthoxw.mongodb.net/?retryWrites=true&w=majority";

const app = express();

mongoose
  .connect(MONGODB_URI, { family: 4 })
  .then(() => console.log("🧉 Connected to database"))
  .catch((error) => console.error("Could not connect to database", error));

app.use(cors());

const httpServer = http.createServer(app);

const sessionParser = session({
  secret: "secret",
  resave: true,
  saveUninitialized: true,
  store: MongoStore.create({
    client: mongoose.connection.getClient(),
  }),
});

app.use(sessionParser);

const wss = new Server({ server: httpServer });

wss.on("connection", (socket: WebSocketWithSessionData) => {
  console.log("A socket connected");

  socket.on("message", (message) => {
    const command = message.toString();
    gameController(socket, command);
  });

  socket.on("close", () => {
    Game.findById(socket.sessionData?.gameId).deleteOne();
    console.log("A socket disconnected");
  });
});

httpServer.listen(PORT, () => {
  console.log(`🚀 Server ready at http://localhost:${PORT}/`);
});
