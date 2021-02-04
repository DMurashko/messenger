const express = require('express');
const app = express();
const server = require('http').createServer(app);
const WebSocket = require('ws');
const mongoose = require('mongoose');
const config = require('config');
const cors = require('cors');
import fromNow from '../customFunctions/fromNow';
import {AuthRouter, START_TIME} from './src/authRouter';
import validateEmail from '../customFunctions/validateEmail';
import { dbRouter } from './src/userDataRouter';

const PORT = 3001;
const wss = new WebSocket.Server({ server:server, clientTracking: true });

app.use(express.json());
app.use(cors());

app.use('/api/auth', AuthRouter);
app.use('/api/db/', dbRouter);

app.get('/', (req, res) => res.json({started: fromNow(START_TIME), body: req.body}));

wss.on('connection', function connection(ws) {
  console.log('A new client Connected!');
  ws.send('Welcome New Client!');

  ws.on('message', function incoming(message) {
    console.log('received: %s', message);

    wss.clients.forEach(function each(client) {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
    
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
