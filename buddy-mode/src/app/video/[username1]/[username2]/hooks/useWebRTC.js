import { useState, useEffect } from 'react';
import {
    sendOffer,
    sendAnswer,
    sendCandidate,
    listenToOffer,
    listenToAnswer,
    listenToCandidates,
    joinServer,
    removeUser,
} from '../../../../utils/firebaseSignaling';

export const useWebRTC = (username1, username2, localStream) => {
    const [peerConnection, setPeerConnection] = useState(null);
    const [connectionStatus, setConnectionStatus] = useState('initializing');
    const [isSharingScreen, setIsSharingScreen] = useState(false);
    const [screenStream, setScreenStream] = useState(null);

    useEffect(() => {
        if (!username1 || !username2 || !localStream) return;

        const pc = new RTCPeerConnection({
            iceServers: [
                { urls: 'stun:stun.l.google.com:19302' },
                { urls: 'stun:stun1.l.google.com:19302' },
                { urls: 'stun:stun2.l.google.com:19302' },
            ],
            iceCandidatePoolSize: 10,
        });

        setPeerConnection(pc);

        // Add local stream tracks to peer connection
        localStream.getTracks().forEach((track) => pc.addTrack(track, localStream));

        pc.onconnectionstatechange = () => setConnectionStatus(pc.connectionState);

        pc.onicecandidate = (event) => {
            if (event.candidate) sendCandidate(username2, event.candidate);
        };

        pc.ontrack = (event) => {
            console.log('Remote track received:', event.streams[0]);
        };

        const unsubscribeOffer = listenToOffer(username1, async (offer) => {
            if (offer && offer.type === 'offer' && offer.sdp) {
                try {
                    await pc.setRemoteDescription(new RTCSessionDescription(offer));
                    const answer = await pc.createAnswer();
                    await pc.setLocalDescription(answer);
                    sendAnswer(username2, answer);
                } catch (error) {
                    console.error('Failed to handle offer:', error);
                }
            }
        });

        const unsubscribeAnswer = listenToAnswer(username1, async (answer) => {
            if (answer && answer.type === 'answer' && answer.sdp) {
                try {
                    await pc.setRemoteDescription(new RTCSessionDescription(answer));
                } catch (error) {
                    console.error('Failed to set remote description:', error);
                }
            }
        });

        const unsubscribeCandidates = listenToCandidates(username1, async (candidates) => {
            for (const candidate of candidates) {
                try {
                    await pc.addIceCandidate(new RTCIceCandidate(candidate));
                } catch (error) {
                    console.error('Failed to add ICE candidate:', error);
                }
            }
        });

        const createAndSendOffer = async () => {
            if (username1 < username2) {
                try {
                    const offer = await pc.createOffer();
                    await pc.setLocalDescription(offer);
                    await sendOffer(username2, offer);
                } catch (error) {
                    console.error('Failed to create or send offer:', error);
                }
            }
        };

        joinServer(username1);
        setTimeout(createAndSendOffer, 1000);

        return () => {
            removeUser(username1);
            unsubscribeOffer();
            unsubscribeAnswer();
            unsubscribeCandidates();
            if (pc) pc.close();
            if (screenStream) {
                screenStream.getTracks().forEach((track) => track.stop());
            }
        };
    }, [username1, username2, localStream, screenStream]);

    const startScreenShare = async () => {
        console.log('Attempting to start screen share');
        try {
            const stream = await navigator.mediaDevices.getDisplayMedia({ video: true });
            console.log('Screen sharing stream initialized:', stream);
            setScreenStream(stream);

            const screenTrack = stream.getVideoTracks()[0];
            const sender = peerConnection.getSenders().find((s) => s.track.kind === 'video');
            if (sender) {
                await sender.replaceTrack(screenTrack);
                console.log('Screen track replaced in PeerConnection');
            }

            setIsSharingScreen(true);

            screenTrack.onended = () => {
                console.log('Screen sharing stopped by user');
                stopScreenShare();
            };
        } catch (error) {
            console.error('Failed to start screen sharing:', error);
        }
    };

    const stopScreenShare = () => {
        if (screenStream) {
            screenStream.getTracks().forEach((track) => track.stop());
            setScreenStream(null);
        }

        // Replace the screen track with the original camera track
        const cameraTrack = localStream.getVideoTracks()[0];
        const sender = peerConnection.getSenders().find((s) => s.track.kind === 'video');
        if (sender) {
            sender.replaceTrack(cameraTrack);
        }

        setIsSharingScreen(false);
    };

    return {
        peerConnection,
        connectionStatus,
        isSharingScreen,
        startScreenShare,
        stopScreenShare,
    };
};
