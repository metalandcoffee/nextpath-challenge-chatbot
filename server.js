import express from 'express';
import { WebSocketServer } from 'ws';

// Start HTTP server and listen on port 3000.
const app = express()
const port = 3000

app.get('/', (req, res) => {
  res.send('Hello World! It\'s Metal & Coffee!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

// Create WebSocket using same HTTP server.
const wss = new WebSocketServer({ server: app });

wss.on('connection', function connection(ws) {
    console.log('A new client has connected.');
  ws.on('error', console.error);

  // Triggered when server receives message from client.
  ws.on('message', function message(data) {
    console.log('received: %s', data);
  });

//   ws.send('something');
});