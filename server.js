import express from 'express';
import { WebSocketServer } from 'ws';

// Start HTTP server and listen on port 3000.
const server = express()
const port = 3000

server.get('/', (req, res) => {
  res.send('Hello World! It\'s Metal & Coffee!')
})

server.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

// Create WebSocket using same HTTP server.
const wss = new WebSocketServer({ server });

wss.on('connection', function connection(ws) {
    console.log('A new client has connected.');
  ws.on('error', console.error);

  // Triggered when server receives message from client.
  ws.on('message', function message(data) {
    console.log('received: %s', data);
  });

//   ws.send('something');
});