// useWebRTC.js
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

        localStream.getTracks().forEach((track) => pc.addTrack(track, localStream));

        pc.onconnectionstatechange = () => setConnectionStatus(pc.connectionState);

        pc.onicecandidate = (event) => {
            if (event.candidate) sendCandidate(username2, event.candidate);
        };

        pc.ontrack = (event) => {
            console.log('Remote track received:', event.streams[0]);
        };

        const unsubscribeOffer = listenToOffer(username1, async (offer) => {
            if (offer?.type === 'offer') {
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
            if (answer?.type === 'answer') {
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
                    sendOffer(username2, offer);
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
            pc.close();
        };
    }, [username1, username2, localStream]);

    // Expose a function to replace the video track
    const replaceVideoTrack = (newTrack) => {
        if (peerConnection) {
            const sender = peerConnection.getSenders().find((s) => s.track.kind === 'video');
            if (sender) sender.replaceTrack(newTrack);
        }
    };

    return {
        peerConnection,
        connectionStatus,
        replaceVideoTrack,
    };
};
