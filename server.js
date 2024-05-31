const WebSocket = require('ws');

const ws = new WebSocket('ws://192.168.110.68:3002/1bYh0LFvHfeFso5s');
const crypto = require('crypto');


ws.on('open', function open() {
    console.log('Connected to the WebSocket server.');


    const key1 = 'gbNoVItWegx93HvV6Nuv9cDwRjdV1X1O';
    const buff = Buffer.from(key1, "utf-8");

    console.log(buff); 
    const algorithm = 'aes-256-ecb';
    const key = crypto.randomBytes(16);
    console.log(key);
    const jsonPayload = {
    "deviceId": "yqN9iNdeHGV71Ivf",
    "temp": "25"
    };

const cipher = crypto.createCipheriv(algorithm, key1, Buffer.alloc(0));
let encryptedData = cipher.update(JSON.stringify(jsonPayload), 'utf-8', 'hex');
encryptedData += cipher.final('hex');

console.log('Encrypted Data:', encryptedData);

    
    // Send a message to the server
    const jsonMessage = {
        device: 'greeting',
        content: 'Hello from the client!',
    };
    ws.send(JSON.stringify(jsonMessage));   
});

ws.on('message', function (msg) {
    console.log('Received message from the server:', msg.toString('utf-8'));
});

ws.on('close', function close() {
    console.log('Disconnected from the WebSocket server.');
});

// You can also handle errors
ws.on('error', function error(error) {
    console.error('WebSocket error:', error);
});


