'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
    sendOffer,
    sendAnswer,
    sendCandidate,
    listenToOffer,
    listenToAnswer,
    listenToCandidates,
    joinServer,
    removeUser,
} from '../../../utils/firebaseSignaling';

export default function VideoChatPage({ params }) {
    const [username1, setUsername1] = useState(null);
    const [username2, setUsername2] = useState(null);
    const [peerConnection, setPeerConnection] = useState(null);
    const [localStream, setLocalStream] = useState(null);
    const [connectionStatus, setConnectionStatus] = useState('initializing');

    const localVideoRef = useRef(null);
    const remoteVideoRef = useRef(null);
    const router = useRouter();

    useEffect(() => {
        const decodedUsername1 = decodeURIComponent(params.username1);
        const decodedUsername2 = decodeURIComponent(params.username2);
        setUsername1(decodedUsername1);
        setUsername2(decodedUsername2);

        // Firebase에 사용자 등록
        joinServer(decodedUsername1);

        // RTCPeerConnection 생성
        const pc = new RTCPeerConnection({
            iceServers: [
                { urls: 'stun:stun.l.google.com:19302' },
                { urls: 'stun:stun1.l.google.com:19302' },
                { urls: 'stun:stun2.l.google.com:19302' },
            ],
            iceCandidatePoolSize: 10,
        });
        setPeerConnection(pc);

        // 연결 상태 모니터링
        pc.onconnectionstatechange = () => {
            console.log('Connection State:', pc.connectionState);
            setConnectionStatus(pc.connectionState);
        };

        pc.oniceconnectionstatechange = () => {
            console.log('ICE Connection State:', pc.iceConnectionState);
        };

        pc.onicegatheringstatechange = () => {
            console.log('ICE Gathering State:', pc.iceGatheringState);
        };

        // 로컬 스트림 초기화
        navigator.mediaDevices
            .getUserMedia({ video: true, audio: true })
            .then((stream) => {
                console.log('Got local stream');
                localVideoRef.current.srcObject = stream;
                setLocalStream(stream);
                stream.getTracks().forEach((track) => {
                    console.log('Adding track to peer connection:', track.kind);
                    pc.addTrack(track, stream);
                });
            })
            .catch((error) => {
                console.error('Error accessing media devices:', error);
            });

        // ICE Candidate 생성 시 Firebase로 전달
        pc.onicecandidate = (event) => {
            if (event.candidate) {
                console.log('New ICE candidate:', event.candidate);
                sendCandidate(decodedUsername2, event.candidate);
            }
        };

        // 원격 스트림 설정
        pc.ontrack = (event) => {
            console.log('Received remote track:', event.track.kind);
            if (remoteVideoRef.current && event.streams[0]) {
                console.log('Setting remote stream');
                remoteVideoRef.current.srcObject = event.streams[0];
            }
        };

        // Firebase에서 Offer 수신
        const unsubscribeOffer = listenToOffer(decodedUsername1, async (offer) => {
            console.log('Processing received offer');
            if (offer && offer.type === 'offer' && offer.sdp) {
                try {
                    await pc.setRemoteDescription(new RTCSessionDescription(offer));
                    console.log('Remote description set successfully');

                    const answer = await pc.createAnswer();
                    console.log('Created answer:', answer);

                    await pc.setLocalDescription(answer);
                    console.log('Local description set successfully');

                    sendAnswer(decodedUsername2, answer);
                } catch (error) {
                    console.error('Failed to handle offer:', error);
                }
            }
        });

        // Firebase에서 Answer 수신
        const unsubscribeAnswer = listenToAnswer(decodedUsername1, async (answer) => {
            console.log('Processing received answer');
            if (answer && answer.type === 'answer' && answer.sdp) {
                try {
                    await pc.setRemoteDescription(new RTCSessionDescription(answer));
                    console.log('Remote description set successfully from answer');
                } catch (error) {
                    console.error('Failed to set remote description:', error);
                }
            }
        });

        // Firebase에서 ICE Candidates 수신
        const unsubscribeCandidates = listenToCandidates(decodedUsername1, async (candidates) => {
            console.log('Processing received candidates:', candidates);
            for (const candidate of candidates) {
                try {
                    await pc.addIceCandidate(new RTCIceCandidate(candidate));
                    console.log('Added ICE candidate successfully');
                } catch (error) {
                    console.error('Failed to add ICE candidate:', error);
                }
            }
        });

        // Offer 생성 및 전송 (호스트 역할)
        const createAndSendOffer = async () => {
            if (decodedUsername1 < decodedUsername2) {
                try {
                    const offer = await pc.createOffer();
                    console.log('Created offer:', offer);

                    await pc.setLocalDescription(offer);
                    console.log('Local description set successfully');

                    await sendOffer(decodedUsername2, offer);
                    console.log('Offer sent successfully');
                } catch (error) {
                    console.error('Failed to create or send offer:', error);
                }
            }
        };

        // 잠시 대기 후 Offer 생성 (스트림 설정 시간 확보)
        setTimeout(createAndSendOffer, 1000);

        return () => {
            console.log('Cleaning up video chat');
            removeUser(decodedUsername1);
            unsubscribeOffer();
            unsubscribeAnswer();
            unsubscribeCandidates();

            if (pc) {
                pc.close();
            }
            if (localStream) {
                localStream.getTracks().forEach((track) => track.stop());
            }
        };
    }, [params]);

    const endCall = () => {
        if (localStream) {
            localStream.getTracks().forEach((track) => track.stop());
        }
        router.push(`/space/${encodeURIComponent(username1)}/${encodeURIComponent(username2)}`);
    };

    return (
        <div className="p-4">
            <h1 className="text-xl mb-4">
                화상 채팅: {username1} & {username2} ({connectionStatus})
            </h1>
            <div className="flex flex-wrap gap-4">
                <div className="relative">
                    <video
                        ref={localVideoRef}
                        autoPlay
                        muted
                        className="w-[400px] h-[300px] object-cover border rounded"
                    />
                    <p className="absolute bottom-2 left-2 bg-black/50 text-white px-2 py-1 rounded">
                        나 ({username1})
                    </p>
                </div>
                <div className="relative">
                    <video ref={remoteVideoRef} autoPlay className="w-[400px] h-[300px] object-cover border rounded" />
                    <p className="absolute bottom-2 left-2 bg-black/50 text-white px-2 py-1 rounded">
                        상대방 ({username2})
                    </p>
                </div>
            </div>
            <button onClick={endCall} className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">
                화상 채팅 끝내기
            </button>
        </div>
    );
}
