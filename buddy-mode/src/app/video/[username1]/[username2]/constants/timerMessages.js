import { faToggleOn, faToggleOff } from '@fortawesome/free-solid-svg-icons';

export const TIMER_MESSAGES = {
    0: {
        message: { text1: '상대 버디를 기다리고 있습니다...', text2: '', icon1: faToggleOff, icon2: faToggleOff },
    },
    1: {
        message: (remainingTime) => ({
            text1: `ko ${formatTime(remainingTime)}`,
            text2: `jp 15:00`,
            icon1: faToggleOn,
            icon2: faToggleOff,
        }),
    },
    2: {
        message: (remainingTime) => ({
            text1: `ko 0:00`,
            text2: `jp ${formatTime(remainingTime)}`,
            icon1: faToggleOff,
            icon2: faToggleOn,
        }),
    },
    FINISHED: {
        message: { text1: '오늘의 대화가 종료되었습니다.', text2: '', icon1: faToggleOff, icon2: faToggleOff },
    },
};

// 시간 포맷 함수
export const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};
