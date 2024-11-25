import React from 'react';
import styled from 'styled-components';

const ScreenShareContainer = styled.div`
    position: relative;
    width: 430px;
    height: 660px;
    border-radius: 12px;
    overflow: hidden;
    background-color: ${(props) => props.theme.colors.white};
`;

const VideoElement = styled.video`
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 12px;
`;

const Placeholder = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    border-radius: 12px;
    background-color: #f4f4f4;
    font-size: 16px;
`;

const ScreenShareDisplay = ({ isSharingScreen, screenVideoRef }) => (
    <ScreenShareContainer>
        {isSharingScreen ? (
            <VideoElement ref={screenVideoRef} autoPlay playsInline />
        ) : (
            <Placeholder>화면 공유가 활성화되지 않았습니다</Placeholder>
        )}
    </ScreenShareContainer>
);

export default ScreenShareDisplay;
