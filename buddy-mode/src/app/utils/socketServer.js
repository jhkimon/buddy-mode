let users = {}; // 연결된 사용자들 (키: username)

export const setupWebSocketServer = (server) => {
    if (!server.websocketServer) {
        const WebSocket = require("ws");
        const wss = new WebSocket.Server({ noServer: true });

        // HTTP 업그레이드 이벤트를 WebSocket 연결로 처리
        server.on("upgrade", (req, socket, head) => {
            wss.handleUpgrade(req, socket, head, (ws) => {
                wss.emit("connection", ws, req);
            });
        });

        // WebSocket 연결 처리
        wss.on("connection", (ws, req) => {
            let username = null;

            ws.on("message", (message) => {
                const parsedMessage = JSON.parse(message);

                if (parsedMessage.type === "join") {
                    // 사용자가 방에 연결
                    username = parsedMessage.username;
                    users[username] = ws;
                    console.log(`${username} joined the WebSocket server.`);
                }

                if (parsedMessage.type === "offer" || parsedMessage.type === "answer") {
                    // SDP Offer/Answer 전달
                    const targetUser = parsedMessage.target;
                    if (users[targetUser]) {
                        users[targetUser].send(JSON.stringify(parsedMessage));
                    }
                }

                if (parsedMessage.type === "candidate") {
                    // ICE Candidate 전달
                    const targetUser = parsedMessage.target;
                    if (users[targetUser]) {
                        users[targetUser].send(JSON.stringify(parsedMessage));
                    }
                }
            });

            ws.on("close", () => {
                console.log(`${username} disconnected.`);
                delete users[username];
            });
        });

        server.websocketServer = wss;
    }
};
