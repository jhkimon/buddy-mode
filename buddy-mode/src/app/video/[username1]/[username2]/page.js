// VideoChatPage.js
'use client';

import { useRef, useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ThemeProvider } from 'styled-components';
import { theme } from './style/videoStyles';
import { Header } from './components/Header';
import { VideoDisplay } from './components/VideoDisplay';
import ScreenShareDisplay from './components/ScreenShareDisplay';

import { Controls } from './components/Controls';
import { Container, ContentWrapper, SharedContent } from './components/Layout';
import { useVideoStream } from './hooks/useVideoStream';
import { useWebRTC } from './hooks/useWebRTC';
import { useScreenShare } from './hooks/useScreenShare'; // Import the new hook
import { useTimer } from './hooks/useTimer';

export default function VideoChatPage() {
    const params = useParams();
    const [username1, setUsername1] = useState(null);
    const [username2, setUsername2] = useState(null);
    const [isPartnerConnected, setIsPartnerConnected] = useState(false);

    const localVideoRef = useRef(null);
    const remoteVideoRef = useRef(null);
    const screenVideoRef = useRef(null);
    const router = useRouter();

    const { localStream, isMicOn, isCameraOn, toggleMic, toggleCamera } = useVideoStream();

    const { peerConnection, connectionStatus, replaceVideoTrack } = useWebRTC(username1, username2, localStream);

    const { isSharingScreen, screenStream, startScreenShare, stopScreenShare } = useScreenShare(
        localStream,
        replaceVideoTrack
    );

    const { headerMessage } = useTimer(isPartnerConnected, connectionStatus);

    useEffect(() => {
        async function fetchParams() {
            const resolvedParams = await params;
            const decodedUsername1 = decodeURIComponent(resolvedParams.username1);
            const decodedUsername2 = decodeURIComponent(resolvedParams.username2);
            setUsername1(decodedUsername1);
            setUsername2(decodedUsername2);
        }

        fetchParams();
        setTimeout(() => setIsPartnerConnected(true), 10000);
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

    // Use the screenStream from the useScreenShare hook
    useEffect(() => {
        if (screenStream && screenVideoRef.current) {
            console.log('Setting screenStream to video element', screenStream);
            screenVideoRef.current.srcObject = screenStream;
        } else {
            console.log('No screenStream available');
        }
    }, [screenStream]);

    const toggleScreenShare = () => {
        if (isSharingScreen) {
            stopScreenShare();
        } else {
            startScreenShare();
        }
    };

    const endCall = () => {
        if (localStream) {
            localStream.getTracks().forEach((track) => track.stop());
        }
        if (screenStream) {
            screenStream.getTracks().forEach((track) => track.stop());
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
                        <ScreenShareDisplay isSharingScreen={isSharingScreen} screenVideoRef={screenVideoRef} />
                    </SharedContent>
                </ContentWrapper>

                <Controls
                    isCameraOn={isCameraOn}
                    isMicOn={isMicOn}
                    isScreenOn={isSharingScreen}
                    toggleCamera={toggleCamera}
                    toggleMic={toggleMic}
                    toggleScreen={toggleScreenShare}
                    onEndCall={endCall}
                />
            </Container>
        </ThemeProvider>
    );
}
