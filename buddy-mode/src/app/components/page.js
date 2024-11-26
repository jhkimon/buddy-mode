'use client';

import React from 'react';
import FlexibleButton from './common/button';
import Chat from './chat';
import {
    faArrowPointer,
    faArrowsRotate,
    faBook,
    faBookmark as faBookmarkOutline,
    faArrowLeft,
    faVideo,
    faVideoSlash,
    faEyeSlash,
    faMicrophoneAltSlash,
    faDownload,
    faStop,
} from '@fortawesome/free-solid-svg-icons';
import { BUTTON_STYLES } from '@/style/buttonStyles';
import { CHAT_STYLES } from '@/style/chatStyles';
import GNB from './common/gnb';
import Tab from './tab';
import ProfileImage from './profileImage';

const DesignPage = () => {
    return (
        <div style={{ backgroundColor: '#dddddd', padding: '20px' }}>
            <h1>Profile</h1>
            <ProfileImage />
            <h1>Buttons</h1>
            <FlexibleButton text="프로필 보기" icon={faArrowPointer} {...BUTTON_STYLES.PURPLE} />
            <p></p>
            <FlexibleButton text="버디 연결 요청하기" icon={faArrowsRotate} {...BUTTON_STYLES.PURPLE} />
            <p></p>
            <FlexibleButton text="저장하기" icon={faBookmarkOutline} {...BUTTON_STYLES.WHITE} />
            <p></p>
            <FlexibleButton text="프로필 보기" icon={faArrowPointer} {...BUTTON_STYLES.PURPLE_LARGE} />
            <p></p>
            <FlexibleButton text="교재 둘러보기" icon={faBook} {...BUTTON_STYLES.WHITE} />
            <p></p>
            <FlexibleButton text="돌아가기" icon={faArrowLeft} {...BUTTON_STYLES.WHITE} />
            <p></p>
            <FlexibleButton text="오늘의 교재 확인하기" icon={faBook} {...BUTTON_STYLES.PURPLE} />
            <p></p>
            <FlexibleButton text="수업 시작하기" icon={faVideo} {...BUTTON_STYLES.BLUE} />
            <p></p>
            <FlexibleButton text="수업 시작하기" icon={faVideo} {...BUTTON_STYLES.BLUE_LARGE} />
            <p></p>
            <FlexibleButton text="수업 끝내기" icon={faVideoSlash} {...BUTTON_STYLES.BLUE} />
            <p></p>
            <FlexibleButton text="나의 카메라 끄기" icon={faEyeSlash} {...BUTTON_STYLES.PURPLE} />
            <p></p>
            <FlexibleButton text="나의 마이크 끄기" icon={faMicrophoneAltSlash} {...BUTTON_STYLES.PURPLE} />
            <p></p>
            <FlexibleButton text="교재 PDF로 저장하기" icon={faDownload} {...BUTTON_STYLES.WHITE} width="170px" />
            <p></p>
            <FlexibleButton text="화면공유 끝내기" icon={faStop} {...BUTTON_STYLES.PURPLE} width="170px" />
            <h1>Chatting</h1>
            <Chat text="HI👋 Good to see you again." styleType={CHAT_STYLES.MY} />
            <p></p>
            <Chat text="HI👋 Good to see you again." styleType={CHAT_STYLES.BUDDY} />
            <h1>NAV</h1>
            <GNB />
            <Tab />
        </div>
    );
};

export default DesignPage;
