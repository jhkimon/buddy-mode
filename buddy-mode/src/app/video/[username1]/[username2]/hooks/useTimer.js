import { useState, useEffect } from 'react';
import { TIMER_MESSAGES, formatTime } from '../constants/timerMessages';

export const useTimer = (isPartnerConnected) => {
    const [timerStage, setTimerStage] = useState(0);
    const [remainingTime, setRemainingTime] = useState(10);
    const [headerMessage, setHeaderMessage] = useState(TIMER_MESSAGES[0].message);

    useEffect(() => {
        let timerInterval;

        if (isPartnerConnected && timerStage > 0) {
            timerInterval = setInterval(() => {
                setRemainingTime((prevTime) => {
                    if (prevTime <= 0) {
                        if (timerStage === 1) {
                            setTimerStage(2);
                            return 10;
                        } else if (timerStage === 2) {
                            clearInterval(timerInterval);
                            setHeaderMessage(TIMER_MESSAGES.FINISHED.message);
                            return 0;
                        }
                    }
                    return prevTime - 1;
                });
            }, 1000);
        }

        return () => clearInterval(timerInterval);
    }, [isPartnerConnected, timerStage]);

    useEffect(() => {
        if (!isPartnerConnected) {
            setHeaderMessage(TIMER_MESSAGES[0].message);
        } else if (TIMER_MESSAGES[timerStage]) {
            const messageFn = TIMER_MESSAGES[timerStage].message;
            const textAndIcon = typeof messageFn === 'function' ? messageFn(remainingTime) : messageFn;

            // 곧 일본어 수업 메시지 표시 (5초 전)
            if (timerStage === 1 && remainingTime <= 5 && remainingTime > 0) {
                setHeaderMessage({
                    text1: `ko ${formatTime(remainingTime)}`,
                    text2: 'jp 15:00 곧 일본어 수업이 시작돼요!',
                    icon1: TIMER_MESSAGES[1].message(remainingTime).icon1,
                    icon2: TIMER_MESSAGES[1].message(remainingTime).icon2,
                });
            } else {
                setHeaderMessage(textAndIcon);
            }
        }
    }, [isPartnerConnected, timerStage, remainingTime]);

    useEffect(() => {
        if (isPartnerConnected) {
            setTimerStage(1);
            setRemainingTime(10);
        }
    }, [isPartnerConnected]);

    return { timerStage, remainingTime, headerMessage };
};
