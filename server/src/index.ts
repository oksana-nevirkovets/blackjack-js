import express from 'express';
import http from 'http';
import cors from 'cors';
import mongoose from 'mongoose';
import session from 'express-session';
import { Server } from 'ws';
import MongoStore from 'connect-mongo';
import { gameController } from './controllers';
import { WebSocketWithSessionData } from './types';
import config from './config';

const app = express();
mongoose
  .connect(config.MONGODB_URI, { family: 4 })
  .then(() => console.log('🧉 Connected to database'))
  .catch(error => console.error('Could not connect to database', error));

app.use(cors());

const httpServer = http.createServer(app);

const sessionParser = session({
  secret: config.SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
  store: MongoStore.create({
    client: mongoose.connection.getClient(),
  }),
});

app.use(sessionParser);

const wss = new Server({ server: httpServer });

wss.on('connection', (socket: WebSocketWithSessionData) => {
  console.log('A socket connected');

  socket.on('message', message => {
    const command = JSON.parse(message.toString('utf-8')).event;
    gameController(socket, command);
  });

  socket.on('close', () => {
    console.log('A socket disconnected');
  });
});

httpServer.listen(config.PORT, () => {
  console.log(`🚀 Server ready at http://localhost:${config.PORT}/`);
});
