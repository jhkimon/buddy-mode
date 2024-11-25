'use client';

import { useRef, useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ThemeProvider } from 'styled-components';
import { theme } from './style/videoStyles';
import { Header } from './components/Header';
import { VideoDisplay } from './components/VideoDisplay';
import { Controls } from './components/Controls';
import { Container, ContentWrapper, SharedContent } from './components/Layout';
import { useVideoStream } from './hooks/useVideoStream';
import { useWebRTC } from './hooks/useWebRTC';
import { useTimer } from './hooks/useTimer';

export default function VideoChatPage() {
    const params = useParams();
    const [username1, setUsername1] = useState(null);
    const [username2, setUsername2] = useState(null);
    const [isPartnerConnected, setIsPartnerConnected] = useState(false);

    const localVideoRef = useRef(null);
    const remoteVideoRef = useRef(null);
    const screenVideoRef = useRef(null); // 화면 공유를 위한 Ref
    const router = useRouter();

    const { localStream, isMicOn, isCameraOn, toggleMic, toggleCamera } = useVideoStream();

    const { peerConnection, connectionStatus, isSharingScreen, startScreenShare, stopScreenShare, screenStream } =
        useWebRTC(username1, username2, localStream);

    const { headerMessage } = useTimer(isPartnerConnected);

    useEffect(() => {
        async function fetchParams() {
            const resolvedParams = await params;
            const decodedUsername1 = decodeURIComponent(resolvedParams.username1);
            const decodedUsername2 = decodeURIComponent(resolvedParams.username2);
            setUsername1(decodedUsername1);
            setUsername2(decodedUsername2);
        }

        fetchParams();
        setTimeout(() => setIsPartnerConnected(true), 3000);
    }, [params]);

    useEffect(() => {
        if (localStream && localVideoRef.current) {
            localVideoRef.current.srcObject = localStream;
        }
    }, [localStream]);

    useEffect(() => {
        if (peerConnection) {
            peerConnection.ontrack = (event) => {
                if (remoteVideoRef.current && event.streams[0]) {
                    remoteVideoRef.current.srcObject = event.streams[0];
                }
            };
        }
    }, [peerConnection]);

    // 화면 공유 스트림을 화면에 연결
    useEffect(() => {
        if (screenStream && screenVideoRef.current) {
            console.log('Setting screenStream to video element', screenStream);
            screenVideoRef.current.srcObject = screenStream;
        } else {
            console.log('No screenStream available');
        }
    }, [screenStream]);

    const endCall = () => {
        if (localStream) {
            localStream.getTracks().forEach((track) => track.stop());
        }
        router.push(`/space/${encodeURIComponent(username1)}/${encodeURIComponent(username2)}`);
    };

    return (
        <ThemeProvider theme={theme}>
            <Container>
                <Header message={headerMessage} />
                <ContentWrapper>
                    <VideoDisplay
                        localVideoRef={localVideoRef}
                        remoteVideoRef={remoteVideoRef}
                        username1={username1}
                        username2={username2}
                        isCameraOn={isCameraOn}
                    />
                    <SharedContent>
                        {isSharingScreen ? (
                            <video
                                ref={screenVideoRef}
                                autoPlay
                                playsInline
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'contain',
                                    borderRadius: '8px',
                                    backgroundColor: '#f4f4f4',
                                }}
                            />
                        ) : (
                            <div
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    height: '100%',
                                    backgroundColor: '#f4f4f4',
                                    borderRadius: '8px',
                                    color: '#333',
                                    fontSize: '16px',
                                }}
                            >
                                화면 공유가 활성화되지 않았습니다
                            </div>
                        )}
                    </SharedContent>
                </ContentWrapper>
                <Controls
                    isCameraOn={isCameraOn}
                    isMicOn={isMicOn}
                    toggleCamera={toggleCamera}
                    toggleMic={toggleMic}
                    onEndCall={endCall}
                />
                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1rem' }}>
                    <button
                        onClick={isSharingScreen ? stopScreenShare : startScreenShare}
                        style={{
                            padding: '0.5rem 1rem',
                            fontSize: '1rem',
                            cursor: 'pointer',
                            backgroundColor: isSharingScreen ? '#f44336' : '#4CAF50',
                            color: '#ffffff',
                            border: 'none',
                            borderRadius: '5px',
                        }}
                    >
                        {isSharingScreen ? '화면 공유 중지' : '화면 공유 시작'}
                    </button>
                </div>
            </Container>
        </ThemeProvider>
    );
}
