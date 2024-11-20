import { WebSocketServer } from 'ws';

let wss = null;

export default function handler(req, res) {
    if (!wss) {
        wss = new WebSocketServer({ noServer: true });
        wss.on('connection', (socket) => {
            socket.on('message', (message) => {
                wss.clients.forEach((client) => {
                    if (client.readyState === WebSocket.OPEN) {
                        client.send(message);
                    }
                });
            });
        });
    }

    if (req.method === 'GET') {
        res.status(200).json({ message: 'WebSocket server is running' });
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
}
