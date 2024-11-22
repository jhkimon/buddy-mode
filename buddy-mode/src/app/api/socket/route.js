import { setupWebSocketServer } from "@/utils/socketServer";

export default function handler(req, res) {
    if (req.method === "GET") {
        res.status(200).end();
        return;
    }

    const { server } = res.socket;

    // WebSocket 서버 설정
    setupWebSocketServer(server);

    res.status(200).end();
}
