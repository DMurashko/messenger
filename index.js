const express = require('express');
const app = express();
const server = require('http').createServer(app);
const mongoose = require('mongoose');
const config = require('config');
const cors = require('cors');
const path = require('path');
import { AuthRouter } from './src/authRouter';
import { addMessageToChannel, createChannel, createMessage } from './src/dbQueries';
import { tempStorage, findUserIdBySocketId } from './src/tempStorage';
import { dbRouter } from './src/dbRouter';

const PORT = config.get('port') || 3001;
const io = require('socket.io')(server, {
  cors: {
    origin: config.get('clientUrl'),
    methods: ["GET", "POST"]
  }
});

app.use(express.json());
app.use(cors());

app.use('/api/auth', AuthRouter);
app.use('/api/db/', dbRouter);

if (process.env.NODE_ENV === 'production') {
  app.use('/', express.static(path.join(__dirname, 'client', 'build')));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

//starting the websockets and defining the event listeners
io.on('connection', client => {
  console.log('client is connected:', client.id);
  //adding new user to the Map object of current connections
  client.on('setId', (userId) => {
    tempStorage.set(userId, client.id);
  });
  //creating channel in the db in Channel model
  client.on('createChannel', (channel) => {
    const newChannel = {
      _id: channel._id,
      members: channel.members,
      messages: channel.messages
    }
    createChannel(newChannel);
    for (let item of channel.members) {
      const peerSocketId = tempStorage.get(item);
      if (peerSocketId)
        io.to(peerSocketId).emit('receiveNewChannel', newChannel);
    }
  });
  client.on('message', (msg) => {
    msg = JSON.parse(msg);
    //creating message in the db in Message model
    createMessage({
      userId: msg.userId,
      channelId: msg.channelId,
      message: msg.body,
      _id: msg._id,
      cb(err, doc) {
        if (err)
          console.log(err);
        if (doc) 
          console.log('message pushed to db successfully');
      }
    });
    //adding message to the channel in db to document`s messages property of Channel model
    addMessageToChannel({
      messageId: msg._id,
      channelId: msg.channelId
    });
    //if receiver online then server sends message directly to the specified socket.id
    for (let item of msg.receiverId) {
      const msgCleared = Object.assign({}, msg);
      delete msgCleared.receiverId;
      delete msgCleared.me;
      const peerSocketIds = tempStorage.get(item);
      if (peerSocketIds)
        io.to(peerSocketIds).emit("message", msgCleared);
    }
  });
  client.on('disconnect', () => {
    tempStorage.delete(findUserIdBySocketId(client.id));
    console.log('Client is disconnected', tempStorage.entries());
  });
});

//establishing connection to the DB and starting the server
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
