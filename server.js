import express from 'express';
import { WebSocketServer } from 'ws';
import { readFile, writeFile } from 'node:fs';

// Start app.
const app = express()
const port = 3000
let chatHistory;
let botMessages;

// Read in chat history and send to client.
readFile('log.txt', 'utf8', (err, data) => {
    if (err) {
        console.log('Log file does not exist. Creating...');
        writeFile('log.txt', '', (err) => {
            if (err) throw err;
        });
    }
    chatHistory = !data ? [] : data.split('\n');
}); 

// Queue up bot acknowledgement messages.
readFile('automatedMessages.txt', 'utf8', (err, data) => {
    if (err) {
        console.log('Log file does not exist.');
        return;
    }
    botMessages = data === '' ? [] : data.split('\n');
}); 

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

// Get random number.
const getRandomBotMsg = () => {
  return botMessages[Math.floor(Math.random() * 15)];
}

// Watch for all connections on WSS.
wss.on('connection', function connection(ws) {
    console.log('A new client has connected.');
    if (chatHistory) ws.send(JSON.stringify(chatHistory));
    ws.on('error', console.error);

    // When connection receives message from client.
    ws.on('message', function message(data) {
        const message = data.toString();
        const botMessage = {user: 'bot', text: getRandomBotMsg() };

        // Update chat logs in memory.
        chatHistory.push(message);
        chatHistory.push(JSON.stringify(botMessage));

        // Update log file.
        writeFile('log.txt', chatHistory.join('\n'), (err) => {
            if (err) throw err;
            console.log('The file has been saved!');
        });

        // Acknowledge message.
        ws.send(JSON.stringify(botMessage));
    });
});