'use client';
import { useEffect, useRef } from 'react';

export default function VideoChat() {
    const localVideoRef = useRef(null);
    const remoteVideoRef = useRef(null);
    const peerConnection = useRef(null);
    const signalingRef = useRef(null);

    useEffect(() => {
        const init = async () => {
            // Signaling 서버 연결
            signalingRef.current = new WebSocket('ws://localhost:8080');

            // WebRTC PeerConnection 설정
            peerConnection.current = new RTCPeerConnection({
                iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
            });

            // Local 비디오/오디오 스트림 가져오기
            const localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            localStream.getTracks().forEach((track) => peerConnection.current.addTrack(track, localStream));
            if (localVideoRef.current) localVideoRef.current.srcObject = localStream;

            // Remote 스트림 설정
            peerConnection.current.ontrack = (event) => {
                const [stream] = event.streams;
                if (remoteVideoRef.current) remoteVideoRef.current.srcObject = stream;
            };

            // ICE Candidate 교환
            peerConnection.current.onicecandidate = (event) => {
                if (event.candidate) {
                    signalingRef.current.send(JSON.stringify({ candidate: event.candidate }));
                }
            };

            // Signaling 서버에서 메시지 수신
            signalingRef.current.onmessage = async (event) => {
                const data = JSON.parse(event.data);

                if (data.offer) {
                    await peerConnection.current.setRemoteDescription(new RTCSessionDescription(data.offer));
                    const answer = await peerConnection.current.createAnswer();
                    await peerConnection.current.setLocalDescription(answer);
                    signalingRef.current.send(JSON.stringify({ answer }));
                } else if (data.answer) {
                    await peerConnection.current.setRemoteDescription(new RTCSessionDescription(data.answer));
                } else if (data.candidate) {
                    await peerConnection.current.addIceCandidate(new RTCIceCandidate(data.candidate));
                }
            };

            // Offer 생성 (호스트 유저)
            const offer = await peerConnection.current.createOffer();
            await peerConnection.current.setLocalDescription(offer);
            signalingRef.current.send(JSON.stringify({ offer }));
        };

        init();
    }, []);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
            <video
                ref={localVideoRef}
                autoPlay
                muted
                style={{ width: '300px', borderRadius: '8px', background: '#000' }}
            />
            <video ref={remoteVideoRef} autoPlay style={{ width: '300px', borderRadius: '8px', background: '#000' }} />
            <p>화상 및 음성 채팅이 연결되었습니다!</p>
        </div>
    );
}
