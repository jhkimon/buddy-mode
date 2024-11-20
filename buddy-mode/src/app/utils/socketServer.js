let users = [];

export default function handler(req, res) {
    if (req.method === 'GET') {
        res.status(200).end();
        return;
    }

    const { server } = res.socket;
    if (!server.websocketServer) {
        const WebSocket = require('ws');
        const wss = new WebSocket.Server({ noServer: true });

        server.on('upgrade', (req, socket, head) => {
            wss.handleUpgrade(req, socket, head, (ws) => {
                wss.emit('connection', ws, req);
            });
        });

        wss.on('connection', (ws) => {
            ws.on('message', (message) => {
                const parsedMessage = JSON.parse(message);
                if (parsedMessage.type === 'join') {
                    users.push(ws);
                    if (users.length === 2) {
                        users.forEach((user) => user.send(JSON.stringify({ type: 'startChat' })));
                    }
                } else if (parsedMessage.type === 'message') {
                    users.forEach((user) => {
                        if (user !== ws) {
                            user.send(JSON.stringify({ type: 'message', data: parsedMessage.data }));
                        }
                    });
                }
            });

            ws.on('close', () => {
                users = users.filter((user) => user !== ws);
            });
        });

        server.websocketServer = wss;
    }

    res.status(200).end();
}
