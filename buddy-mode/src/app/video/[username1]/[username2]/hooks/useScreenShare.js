// useScreenShare.js
'use client';

import { useState, useEffect } from 'react';

export const useScreenShare = (localStream, replaceVideoTrack) => {
    const [screenStream, setScreenStream] = useState(null);
    const [isSharingScreen, setIsSharingScreen] = useState(false);

    const startScreenShare = async () => {
        if (!replaceVideoTrack) {
            console.error('replaceVideoTrack function is not available');
            return;
        }

        try {
            const stream = await navigator.mediaDevices.getDisplayMedia({ video: true });
            console.log('Got display media stream:', stream);
            setScreenStream(stream);

            const screenTrack = stream.getVideoTracks()[0];
            replaceVideoTrack(screenTrack);

            setIsSharingScreen(true);

            // Stop screen sharing when the user manually stops it
            screenTrack.onended = () => {
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

        if (localStream) {
            const cameraTrack = localStream.getVideoTracks()[0];
            replaceVideoTrack(cameraTrack);
        }

        setIsSharingScreen(false);
    };

    useEffect(() => {
        return () => {
            // Cleanup when the component unmounts
            if (screenStream) {
                screenStream.getTracks().forEach((track) => track.stop());
            }
        };
    }, [screenStream]);

    return {
        isSharingScreen,
        screenStream,
        startScreenShare,
        stopScreenShare,
    };
};
