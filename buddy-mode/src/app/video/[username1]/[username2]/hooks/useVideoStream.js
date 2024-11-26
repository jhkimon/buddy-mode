import { useState, useEffect } from 'react';

export const useVideoStream = () => {
    const [localStream, setLocalStream] = useState(null);
    const [isMicOn, setIsMicOn] = useState(false);
    const [isCameraOn, setIsCameraOn] = useState(false);

    useEffect(() => {
        const initStream = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });

                stream.getAudioTracks().forEach((track) => (track.enabled = false));
                stream.getVideoTracks().forEach((track) => (track.enabled = false));
                setLocalStream(stream);
            } catch (error) {
                console.error('Error accessing media devices:', error);
            }
        };

        initStream();

        return () => {
            if (localStream) {
                localStream.getTracks().forEach((track) => track.stop());
            }
        };
    }, []);

    const toggleMic = () => {
        if (localStream) {
            localStream.getAudioTracks().forEach((track) => {
                track.enabled = !track.enabled;
            });
            setIsMicOn(!isMicOn);
        }
    };

    const toggleCamera = () => {
        if (localStream) {
            localStream.getVideoTracks().forEach((track) => {
                track.enabled = !track.enabled;
            });
            setIsCameraOn(!isCameraOn);
        }
    };

    return {
        localStream,
        isMicOn,
        isCameraOn,
        toggleMic,
        toggleCamera,
    };
};
