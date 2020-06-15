class Websocket {
    middleware (config, lws) {
        const WebSocket = require('ws');
        const wss = new WebSocket.Server({ server: lws.server });

        wss.on('connection', socket => {
            socket.on('message', message => {
                socket.send(`"${message}"? Yep, that's right`);
            })
        })
    }
}

module.exports = Websocket;
