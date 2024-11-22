"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

export default function VideoChatPage({ params }) {
    const [username1, setUsername1] = useState(null);
    const [username2, setUsername2] = useState(null);
    const localVideoRef = useRef(null);
    const remoteVideoRef = useRef(null);
    const [peerConnection, setPeerConnection] = useState(null);
    const [localStream, setLocalStream] = useState(null);
    const router = useRouter();

    // params 언래핑 및 디코딩
    useEffect(() => {
        const decodedUsername1 = decodeURIComponent(params.username1);
        const decodedUsername2 = decodeURIComponent(params.username2);
        setUsername1(decodedUsername1);
        setUsername2(decodedUsername2);

        // WebRTC 초기화
        const pc = new RTCPeerConnection({
            iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
        });
        setPeerConnection(pc);

        navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
            localVideoRef.current.srcObject = stream;
            setLocalStream(stream);
            stream.getTracks().forEach((track) => pc.addTrack(track, stream));
        });

        pc.ontrack = (event) => {
            if (remoteVideoRef.current) remoteVideoRef.current.srcObject = event.streams[0];
        };

        return () => {
            pc.close();
        };
    }, [params]);

    // 화상 채팅 종료
    const endCall = () => {
        if (localStream) {
            localStream.getTracks().forEach((track) => track.stop());
        }
        router.push(`/space/${encodeURIComponent(username1)}/${encodeURIComponent(username2)}`);
    };

    return (
        <div>
            <h1>화상 채팅: {username1} & {username2}</h1>
            <video ref={localVideoRef} autoPlay muted style={{ width: "400px", margin: "10px" }} />
            <video ref={remoteVideoRef} autoPlay style={{ width: "400px", margin: "10px" }} />
            <button onClick={endCall}>화상 채팅 끝내기</button>
        </div>
    );
}
