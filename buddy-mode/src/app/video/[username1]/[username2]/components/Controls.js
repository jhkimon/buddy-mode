import FlexibleButton from '@/app/components/common/button';
import {
    faEye,
    faEyeSlash,
    faMicrophoneAlt,
    faMicrophoneAltSlash,
    faVideoSlash,
} from '@fortawesome/free-solid-svg-icons';
import { BUTTON_STYLES } from '@/constants/buttonStyles';
import styled from 'styled-components';

export const ControlsContainer = styled.div`
    flex: 0 0 5%;
    margin: 10px;
    display: flex;
    gap: 0.5rem;
    justify-content: flex-start;
    align-items: center;
    padding: 0.5rem;
`;

// Controls component
export const Controls = ({ isCameraOn, isMicOn, toggleCamera, toggleMic, onEndCall }) => (
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
        <FlexibleButton onClick={onEndCall} text="수업 끝내기" icon={faVideoSlash} {...BUTTON_STYLES.BLUE} />
    </ControlsContainer>
);
