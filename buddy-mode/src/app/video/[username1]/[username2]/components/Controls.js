import FlexibleButton from '@/app/components/common/button';
import {
    faEye,
    faEyeSlash,
    faMicrophoneAlt,
    faMicrophoneAltSlash,
    faVideoSlash,
    faStop,
    faPlay,
} from '@fortawesome/free-solid-svg-icons';
import { BUTTON_STYLES } from '@/constants/buttonStyles';
import styled from 'styled-components';

export const ControlsWrapper = styled.div`
    flex: 0 0 3%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: ${(props) => props.theme.spacing.lg};
`;

export const ControlsContainer = styled.div`
    flex: 0 0 5%;
    display: flex;
    gap: 0.5rem;
    justify-content: flex-start;
    align-items: center;
`;

// Controls component
export const Controls = ({ isCameraOn, isMicOn, isScreenOn, toggleCamera, toggleMic, toggleScreen, onEndCall }) => (
    <ControlsWrapper>
        <ControlsContainer>
            <FlexibleButton
                text={isCameraOn ? '나의 카메라 끄기' : '나의 카메라 켜기'}
                icon={isCameraOn ? faEye : faEyeSlash}
                onClick={toggleCamera}
                {...BUTTON_STYLES.PURPLE}
            />
            <FlexibleButton
                text={isMicOn ? '나의 마이크 끄기' : '나의 마이크 켜기'}
                icon={isMicOn ? faMicrophoneAlt : faMicrophoneAltSlash}
                onClick={toggleMic}
                {...BUTTON_STYLES.PURPLE}
            />
            <FlexibleButton
                text={isScreenOn ? '화면 공유 멈추기' : '화면 공유 시작'}
                icon={isScreenOn ? faStop : faPlay}
                onClick={toggleScreen}
                {...BUTTON_STYLES.PURPLE}
            />
        </ControlsContainer>
        <FlexibleButton onClick={onEndCall} text="수업 끝내기" icon={faVideoSlash} {...BUTTON_STYLES.BLUE} />
    </ControlsWrapper>
);
