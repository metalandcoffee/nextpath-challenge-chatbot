import express from 'express';
import { WebSocketServer } from 'ws';
import { readFile, writeFile } from 'node:fs';

// Start app.
const app = express()
const port = 3000

app.get('/', (req, res) => {
    res.send('Hello World! It\'s Metal & Coffee!')
})

// Express handles creating HTTP server when binding
// and listening for connections.
const server = app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})

// Create WebSocket using same HTTP server.
const wss = new WebSocketServer({ server });

wss.on('connection', function connection(ws) {
    console.log('A new client has connected.');
    // Read in chat history and send to client.
    readFile('log.txt', (err, data) => {
        if (err) {
            console.log('Log file does not exist.');
            return;
        }
        console.log(data);
    }); 
    ws.on('error', console.error);

    // Triggered when server receives message from client.
    ws.on('message', function message(data) {
        console.log('received: %s', data);
        // @todo read in file. append with timestamp. write to file.
    });

//   ws.send('Acknowledged!');
});