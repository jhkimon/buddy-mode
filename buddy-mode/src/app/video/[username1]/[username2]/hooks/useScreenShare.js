'use client';

import { useState, useEffect, useRef } from 'react';
import {
    setScreenShareOffer,
    listenToScreenShareOffer,
    removeScreenShareOffer,
    sendScreenShareCandidate,
    listenToScreenShareCandidates,
    clearScreenShareCandidates,
} from '../../../../utils/firebaseScreenShares';

export const useScreenShare = (senderId, roomId) => {
    const [screenStream, setScreenStream] = useState(null);
    const [isSharingScreen, setIsSharingScreen] = useState(false);
    const [isReceivingScreenShare, setIsReceivingScreenShare] = useState(false);
    const screenSharePeerConnection = useRef(null);
    const [remoteScreenStream, setRemoteScreenStream] = useState(null);
    const [iceCandidateQueue, setIceCandidateQueue] = useState([]);

    useEffect(() => {
        console.log('Initializing screen share listener');
        // Listen for incoming screen share offers or answers
        const unsubscribe = listenToScreenShareOffer(roomId, async (data) => {
            console.log('Received screen share offer data:', data);
            if (data && data.senderId !== senderId) {
                if (data.type === 'offer') {
                    // Another user started screen sharing
                    await handleIncomingScreenShareOffer(data);
                } else if (data.type === 'answer') {
                    // Received answer to our screen share offer
                    await handleScreenShareAnswer(data);
                }
            } else if (!data) {
                // Screen share has ended
                stopReceivingScreenShare();
            }
        });

        return () => {
            console.log('Cleaning up screen share listener');
            unsubscribe();
        };
    }, [roomId, senderId]);

    const startScreenShare = async () => {
        if (isReceivingScreenShare) {
            console.log('Stopping receiving screen share to start sharing screen');
            stopReceivingScreenShare();
        }
        try {
            console.log('Attempting to start screen sharing');
            const stream = await navigator.mediaDevices.getDisplayMedia({ video: true });
            console.log('Obtained screen stream:', stream);
            setScreenStream(stream);

            // Create a new RTCPeerConnection for screen sharing
            const screenPC = new RTCPeerConnection({
                iceServers: [
                    { urls: 'stun:stun.l.google.com:19302' },
                    { urls: 'stun:stun1.l.google.com:19302' },
                    { urls: 'stun:stun2.l.google.com:19302' },
                ],
            });
            console.log('Created new RTCPeerConnection for screen sharing');
            screenSharePeerConnection.current = screenPC;

            // Add screen track to the peer connection
            stream.getTracks().forEach((track) => {
                console.log('Adding track to screenPC:', track);
                screenPC.addTrack(track, stream);
            });

            // Handle ICE candidates
            screenPC.onicecandidate = (event) => {
                if (event.candidate) {
                    console.log('Sending ICE candidate:', event.candidate);
                    sendScreenShareCandidate(roomId, senderId, event.candidate.toJSON());
                }
            };

            // Create an offer and set local description
            const offer = await screenPC.createOffer();
            console.log('Created screen share offer:', offer);
            await screenPC.setLocalDescription(offer);

            // Send the offer via Firebase
            await setScreenShareOffer(roomId, {
                type: 'offer',
                sdp: offer.sdp,
                senderId: senderId,
            });
            console.log('Screen share offer sent');

            // Listen for remote ICE candidates
            const unsubscribeCandidates = listenToScreenShareCandidates(roomId, senderId, async (candidate) => {
                console.log('Received remote ICE candidate:', candidate);
                try {
                    if (screenPC.remoteDescription) {
                        await screenPC.addIceCandidate(new RTCIceCandidate(candidate));
                    } else {
                        // Queue the candidate
                        setIceCandidateQueue((prevQueue) => [...prevQueue, candidate]);
                        console.log('Queued ICE candidate as remote description is not set yet');
                    }
                } catch (error) {
                    console.error('Error adding received ICE candidate', error);
                }
            });

            // Handle connection state changes
            screenPC.onconnectionstatechange = () => {
                console.log('Screen Share PeerConnection State (startScreenShare):', screenPC.connectionState);
                if (screenPC.connectionState === 'disconnected' || screenPC.connectionState === 'closed') {
                    unsubscribeCandidates();
                }
            };

            setIsSharingScreen(true);
            console.log('Screen sharing started');

            // Stop sharing when the user stops the screen share
            stream.getVideoTracks()[0].onended = () => {
                console.log('Screen sharing stopped by user');
                stopScreenShare();
            };
        } catch (error) {
            console.error('Failed to start screen sharing:', error);
        }
    };

    const stopScreenShare = async () => {
        console.log('Stopping screen share');
        if (screenStream) {
            screenStream.getTracks().forEach((track) => track.stop());
            setScreenStream(null);
        }

        if (screenSharePeerConnection.current) {
            screenSharePeerConnection.current.close();
            screenSharePeerConnection.current = null;
        }

        await removeScreenShareOffer(roomId);
        await clearScreenShareCandidates(roomId);
        setIsSharingScreen(false);
        console.log('Screen share stopped');
    };

    const handleIncomingScreenShareOffer = async (offerData) => {
        if (isSharingScreen) {
            console.log('Stopping screen share to start receiving screen share');
            stopScreenShare();
        }

        try {
            console.log('Handling incoming screen share offer:', offerData);
            // Create a new RTCPeerConnection to receive the screen share
            const screenPC = new RTCPeerConnection({
                iceServers: [
                    { urls: 'stun:stun.l.google.com:19302' },
                    { urls: 'stun:stun1.l.google.com:19302' },
                    { urls: 'stun:stun2.l.google.com:19302' },
                ],
            });
            console.log('Created new RTCPeerConnection for receiving screen share');
            screenSharePeerConnection.current = screenPC;

            // Handle incoming tracks
            screenPC.ontrack = (event) => {
                console.log('Received remote screen track:', event.streams[0]);
                setRemoteScreenStream(event.streams[0]);
                setIsReceivingScreenShare(true);
            };

            // Handle ICE candidates
            screenPC.onicecandidate = (event) => {
                if (event.candidate) {
                    console.log('Sending ICE candidate:', event.candidate);
                    sendScreenShareCandidate(roomId, senderId, event.candidate.toJSON());
                }
            };

            // Listen for remote ICE candidates
            const unsubscribeCandidates = listenToScreenShareCandidates(roomId, senderId, async (candidate) => {
                console.log('Received remote ICE candidate:', candidate);
                try {
                    if (screenPC.remoteDescription) {
                        await screenPC.addIceCandidate(new RTCIceCandidate(candidate));
                    } else {
                        // Queue the candidate
                        setIceCandidateQueue((prevQueue) => [...prevQueue, candidate]);
                        console.log('Queued ICE candidate as remote description is not set yet');
                    }
                } catch (error) {
                    console.error('Error adding received ICE candidate', error);
                }
            });

            // Set remote description
            const offer = {
                type: 'offer',
                sdp: offerData.sdp,
            };
            await screenPC.setRemoteDescription(new RTCSessionDescription(offer));
            console.log('Remote description set for screenPC');

            // Create an answer
            const answer = await screenPC.createAnswer();
            console.log('Created screen share answer:', answer);
            await screenPC.setLocalDescription(answer);

            // Send the answer via Firebase
            await setScreenShareOffer(roomId, {
                type: 'answer',
                sdp: answer.sdp,
                senderId: senderId,
            });
            console.log('Screen share answer sent');

            // Add any queued ICE candidates
            if (iceCandidateQueue.length > 0) {
                console.log('Adding queued ICE candidates');
                for (const candidate of iceCandidateQueue) {
                    try {
                        await screenPC.addIceCandidate(new RTCIceCandidate(candidate));
                    } catch (error) {
                        console.error('Error adding queued ICE candidate', error);
                    }
                }
                // Clear the queue
                setIceCandidateQueue([]);
            }

            // Handle connection state changes
            screenPC.onconnectionstatechange = () => {
                console.log(
                    'Screen Share PeerConnection State (handleIncomingScreenShareOffer):',
                    screenPC.connectionState
                );
                if (screenPC.connectionState === 'disconnected' || screenPC.connectionState === 'closed') {
                    unsubscribeCandidates();
                }
            };
        } catch (error) {
            console.error('Failed to handle incoming screen share offer:', error);
        }
    };

    const handleScreenShareAnswer = async (answerData) => {
        try {
            console.log('Handling screen share answer:', answerData);
            if (screenSharePeerConnection.current) {
                const answer = {
                    type: 'answer',
                    sdp: answerData.sdp,
                };
                await screenSharePeerConnection.current.setRemoteDescription(new RTCSessionDescription(answer));
                console.log('Remote description set for screenSharePeerConnection');

                // Add any queued ICE candidates
                if (iceCandidateQueue.length > 0) {
                    console.log('Adding queued ICE candidates');
                    for (const candidate of iceCandidateQueue) {
                        try {
                            await screenSharePeerConnection.current.addIceCandidate(new RTCIceCandidate(candidate));
                        } catch (error) {
                            console.error('Error adding queued ICE candidate', error);
                        }
                    }
                    // Clear the queue
                    setIceCandidateQueue([]);
                }
            } else {
                console.error('screenSharePeerConnection.current is null in handleScreenShareAnswer');
            }
        } catch (error) {
            console.error('Failed to handle screen share answer:', error);
        }
    };

    const stopReceivingScreenShare = () => {
        console.log('Stopping receiving screen share');
        if (screenSharePeerConnection.current) {
            screenSharePeerConnection.current.close();
            screenSharePeerConnection.current = null;
        }
        if (remoteScreenStream) {
            remoteScreenStream.getTracks().forEach((track) => track.stop());
            setRemoteScreenStream(null);
        }
        setIsReceivingScreenShare(false);
        console.log('Stopped receiving screen share');
    };

    return {
        isSharingScreen,
        isReceivingScreenShare,
        screenStream,
        remoteScreenStream,
        startScreenShare,
        stopScreenShare,
        stopReceivingScreenShare,
    };
};
