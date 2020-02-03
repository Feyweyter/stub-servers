class Websocket {
    middleware (config, lws) {
        const WebSocket = require('ws');
        const wss = new WebSocket.Server({ server: lws.server });

        wss.on('connection', socket => {
            socket.on('message', message => {
                console.log(`Received: ${message}`);
                socket.send("Wow, that's great");
            })
        })
    }
}

module.exports = Websocket;
