import styled from 'styled-components';
import { useEffect, useState } from 'react';
import { faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export const VideoWrapper = styled.div`
    display: flex;
    flex-direction: column;
    gap: ${(props) => props.theme.spacing.md};
    width: 50%;
`;

export const VideoContainer = styled.div`
    position: relative;
    width: 100%;
    height: 330px;
    width: 440px;
    aspect-ratio: 4 / 3;
    border-radius: 12px;
    overflow: hidden;
    background-color: ${(props) => props.theme.colors.white};
`;

// 필터링된 Video 컴포넌트
export const Video = styled.video.withConfig({
    shouldForwardProp: (prop) => prop !== 'isVideoOn',
})`
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 12px;
    visibility: ${(props) => (props.isVideoOn ? 'visible' : 'hidden')};
`;

export const Label = styled.p`
    position: absolute;
    top: 10px;
    left: ${(props) => props.theme.spacing.sm};
    background-color: ${(props) => props.theme.colors.white};
    color: ${(props) => props.theme.colors.primary};
    font-size: 11px;
    font-weight: bold;
    padding: ${(props) => props.theme.spacing.xs} ${(props) => props.theme.spacing.sm};
    border-radius: 4px;
    box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
    margin: 0;
`;

const PlaceholderContent = styled.div`
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: ${(props) => props.theme.colors.black};
    font-size: 14px;
    text-align: center;
`;

export const VideoDisplay = ({ localVideoRef, remoteVideoRef, username1, username2, isCameraOn }) => {
    const [isRemoteVideoActive, setIsRemoteVideoActive] = useState(true);

    useEffect(() => {
        // 상대방 비디오 스트림 상태 확인
        const checkRemoteVideo = () => {
            if (remoteVideoRef.current && remoteVideoRef.current.srcObject) {
                const videoTrack = remoteVideoRef.current.srcObject.getTracks().find((track) => track.kind === 'video');
                setIsRemoteVideoActive(videoTrack ? videoTrack.enabled : false);
            } else {
                setIsRemoteVideoActive(false);
            }
        };

        // 주기적으로 상태 체크
        const interval = setInterval(checkRemoteVideo, 1000);

        // 초기 상태 체크
        checkRemoteVideo();

        return () => clearInterval(interval);
    }, [remoteVideoRef]);

    return (
        <VideoWrapper>
            <VideoContainer>
                <Video ref={remoteVideoRef} autoPlay isVideoOn={isRemoteVideoActive} />
                {!isRemoteVideoActive && (
                    <PlaceholderContent>
                        <FontAwesomeIcon icon={faEyeSlash}></FontAwesomeIcon> Camera Off
                    </PlaceholderContent>
                )}
                <Label>[나의 버디] {username2}</Label>
            </VideoContainer>
            <VideoContainer>
                <Video ref={localVideoRef} autoPlay muted isVideoOn={isCameraOn} />
                {!isCameraOn && (
                    <PlaceholderContent>
                        <FontAwesomeIcon icon={faEyeSlash}></FontAwesomeIcon> Camera Off
                    </PlaceholderContent>
                )}
                <Label>[나] {username1}</Label>
            </VideoContainer>
        </VideoWrapper>
    );
};
