'use client';

import { useRef, useState, useEffect, Component } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ThemeProvider } from 'styled-components';
import { theme } from './style/videoStyles';

// Components
import { Header } from './components/Header';
import { VideoDisplay } from './components/VideoDisplay';
import ScreenShareDisplay from './components/ScreenShareDisplay';
import { Controls } from './components/Controls';
import { Container, ContentWrapper, SharedContent } from './components/Layout';

// Hooks
import { useVideoStream } from './hooks/useVideoStream';
import { useWebRTC } from './hooks/useWebRTC';
import { useScreenShare } from './hooks/useScreenShare';
import { useTimer } from './hooks/useTimer';

export default function VideoChatPage() {
    const params = useParams();
    const [username1, setUsername1] = useState(null);
    const [username2, setUsername2] = useState(null);
    const [isPartnerConnected, setIsPartnerConnected] = useState(false);

    // 각자 화면
    const localVideoRef = useRef(null);
    const remoteVideoRef = useRef(null);

    // 공유 화면
    const screenVideoRef = useRef(null);
    const remoteScreenVideoRef = useRef(null);
    const [localScreenTimestamp, setLocalScreenTimestamp] = useState(0);
    const [remoteScreenTimestamp, setRemoteScreenTimestamp] = useState(0);

    const router = useRouter();

    const { localStream, isMicOn, isCameraOn, toggleMic, toggleCamera } = useVideoStream();

    const { peerConnection, connectionStatus } = useWebRTC(username1, username2, localStream);
    const roomId = [username1, username2].sort().join('_');

    const {
        isSharingScreen,
        isReceivingScreenShare,
        screenStream,
        remoteScreenStream,
        startScreenShare,
        stopScreenShare,
    } = useScreenShare(username1, roomId, peerConnection);

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

    // Local Screen Share Video Stream
    useEffect(() => {
        if (screenStream && screenVideoRef.current) {
            screenVideoRef.current.srcObject = screenStream;
            setLocalScreenTimestamp(Date.now()); // 업데이트 시간 기록
        }
    }, [screenStream, screenVideoRef.current]);

    // Remote Screen Share Video Stream
    useEffect(() => {
        if (remoteScreenStream && remoteScreenVideoRef.current) {
            remoteScreenVideoRef.current.srcObject = remoteScreenStream;
            setRemoteScreenTimestamp(Date.now()); // 업데이트 시간 기록
        }
    }, [remoteScreenStream]);

    const isLocalScreenRecent = localScreenTimestamp > remoteScreenTimestamp;
    console.log('HELP', isLocalScreenRecent);

    // Debug
    useEffect(() => {
        console.log('isSharingScreen:', isSharingScreen);
        console.log('isReceivingScreenShare:', isReceivingScreenShare);
        console.log('screenVideoRef:', screenVideoRef);
        console.log('remoteScreenVideoRef:', remoteScreenVideoRef);
    }, [isSharingScreen, isReceivingScreenShare, screenVideoRef, remoteScreenVideoRef]);

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
        if (remoteScreenStream) {
            remoteScreenStream.getTracks().forEach((track) => track.stop());
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
                        {isSharingScreen && (
                            <ScreenShareDisplay isSharingScreen={isSharingScreen} screenVideoRef={screenVideoRef} />
                        )}
                        {isReceivingScreenShare && (
                            <ScreenShareDisplay
                                isSharingScreen={isReceivingScreenShare}
                                screenVideoRef={remoteScreenVideoRef}
                            />
                        )}
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
