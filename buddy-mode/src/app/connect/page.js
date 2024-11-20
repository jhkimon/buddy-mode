'use client';

import { useEffect, useState, useRef } from 'react';
import styles from './connect.module.css';

const ConnectPage = () => {
    const localVideoRef = useRef(null);
    const remoteVideoRef = useRef(null);

    useEffect(() => {
        const startLocalStream = async () => {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: true,
                audio: true,
            });
            if (localVideoRef.current) {
                localVideoRef.current.srcObject = stream;
            }
        };

        startLocalStream();
    }, []);

    return (
        <div className={styles.container}>
            <h1>Video Chat Room</h1>
            <div className={styles.videoContainer}>
                <video ref={localVideoRef} autoPlay muted className={styles.localVideo} />
                <video ref={remoteVideoRef} autoPlay className={styles.remoteVideo} />
            </div>
            <button className={styles.endCallButton}>End Call</button>
        </div>
    );
};

export default ConnectPage;
