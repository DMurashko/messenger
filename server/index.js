const express = require('express');
const app = express();
const server = require('http').createServer(app);
const mongoose = require('mongoose');
const config = require('config');
const cors = require('cors');
import fromNow from '../customFunctions/fromNow';
import {AuthRouter, START_TIME} from './src/authRouter';
import { addMessageToChannel, createChannel, createMessage } from './src/dbQueries';
import { tempStorage, findUserIdBySocketId } from './src/tempStorage';
import { dbRouter } from './src/userDataRouter';

const PORT = 3001;
const io = require('socket.io')(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

app.use(express.json());
app.use(cors());

app.use('/api/auth', AuthRouter);
app.use('/api/db/', dbRouter);

app.get('/', (req, res) => res.json({started: fromNow(START_TIME), body: req.body}));

io.on('connection', client => {
  console.log('client is connected:', client.id);
  client.on('setId', (userId) => {
    tempStorage.set(userId, client.id);
  });
  client.on('createChannel', (channel) => {
    console.log('Creating a new channel..Messages:', channel.messages);
    createChannel({
      _id: channel._id,
      members: channel.members,
      messages: channel.messages
    });
  });
  client.on('message', (msg) => {
    msg = JSON.parse(msg);
    //db create function call
    createMessage({
      userId: msg.userId,
      channelId: msg.channelId,
      message: msg.body,
      _id: msg._id,
      cb(err, doc) {
        if (err)
          console.log(err);
        if (doc) 
          console.log(doc);
      }
    });
    //db add message to the channel
    addMessageToChannel({
      messageId: msg._id,
      channelId: msg.channelId
    });
    //if receiver online => broadcast to
    //let peerSocketId = tempStorage.get(msg.receiverId);
    //delete msg.receiverId;
    //if (peerSocketId)
    //io.to(peerSocketId).emit("message", msg);
    console.log('message: ' + msg, '\ncliend.id', tempStorage.get(msg.userId));
  });
  client.on('disconnect', () => {
    console.log('Client is disconnected');
  });
});

async function start() {
  try {
    await mongoose.connect(config.get('mongoUri'), {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true
    })
    server.listen(process.env.PORT || PORT, () => console.log(`Lisening on port :${PORT}`));
  } catch (e) {
    console.log('Server Error', e.message)
    process.exit(1)
  }
}

start();

module.exports = {app};