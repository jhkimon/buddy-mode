'use client';

import { useEffect, useState } from 'react';
import { getAllUsers } from './utils/firebaseHelpers';
import GNB from './components/common/gnb'; // GNB 가져오기
import styles from './page.module.css';
import Image from 'next/image';
import {
    faArrowPointer,
    faBook,
    faVideo,
    faPaperPlane,
    faArrowRight,
    faStore,
} from '@fortawesome/free-solid-svg-icons';
import FlexibleButton from './components/common/button';
import { BUTTON_STYLES } from '@/constants/buttonStyles';
import Tab from './components/tab';
import ProfileImage from './components/profileImage';

export default function ChatTest() {
    const [isMobile, setIsMobile] = useState(false); // 모바일 차단
    const [currentUser, setCurrentUser] = useState(null); // 현재 사용자 정보
    const [profiles, setProfiles] = useState([]); // 다른 사용자 목록
    const [selectedUser, setSelectedUser] = useState(null); // 선택된 사용자

    // 모바일 확인
    useEffect(() => {
        const userAgent = navigator.userAgent || navigator.vendor || window.opera;
        setIsMobile(/Mobile|Android|iPhone|iPad|iPod/i.test(userAgent));
    }, []);

    // 로그인한 사용자 정보 가져오기
    useEffect(() => {
        const user = localStorage.getItem('currentUser');
        if (user) {
            setCurrentUser(JSON.parse(user));
        }
    }, []);

    // Realtime Database에서 사용자 목록 가져오기
    useEffect(() => {
        const fetchProfiles = async () => {
            const allUsers = await getAllUsers();

            // 현재 사용자 제외
            const filteredUsers = allUsers.filter((user) => user.name !== currentUser?.name);

            setProfiles(filteredUsers);
        };

        if (currentUser) {
            fetchProfiles();
        }
    }, [currentUser]);

    // 채팅방 연결 핸들러
    const handleChatConnection = () => {
        if (!selectedUser) {
            alert('채팅할 사용자를 선택해주세요.');
            return;
        }

        // 이름 기반으로 채팅방 URL 생성
        const chatRoomUrl = `/space/${currentUser.name}/${selectedUser.name}`;
        window.location.href = chatRoomUrl;
    };

    if (isMobile) {
        // 모바일 전용 UI
        return (
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100vh',
                    backgroundColor: '#F7F8FA',
                    textAlign: 'center',
                    padding: '20px',
                    fontFamily: "'Arial', sans-serif",
                }}
            >
                <div
                    style={{
                        backgroundColor: '#FFFFFF',
                        padding: '40px',
                        borderRadius: '20px',
                        boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
                    }}
                >
                    <Image
                        src="/favicon.ico"
                        alt="Logo"
                        width={150}
                        height={150}
                        style={{
                            marginBottom: '20px',
                            borderRadius: '50%',
                        }}
                    />
                    <h1
                        style={{
                            fontSize: '24px',
                            fontWeight: 'bold',
                            color: '#39355F',
                            marginBottom: '10px',
                        }}
                    >
                        현재 모바일 서비스는 준비중입니다.
                    </h1>
                    <p
                        style={{
                            fontSize: '16px',
                            color: '#7A7A7A',
                            lineHeight: '1.6',
                        }}
                    >
                        빠른 시일 내에 모바일도 지원할 예정입니다.
                        <br />
                        데스크톱에서 접속해 주세요.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div>
            <div>
                <GNB />
            </div>
            <div className={styles.bannerContainer}>
                <Image
                    src="/images/buddybanner.png" // public/banner.jpg 경로
                    alt="배너 이미지"
                    width={1440} /* 부모 너비에 맞게 조정 */
                    height={240} /* 비율 유지 */
                    className={styles.bannerImage} // CSS로 스타일 조정
                />
            </div>
            <div className={styles.bannerText}>
                <div className={styles.bannerText1}>버디모드가 골라주는</div>
                <div className={styles.bannerText2}>
                    <span className={styles.orangeText}>나와 딱 맞는</span>
                    <span className={styles.purpleText}> 버디!</span>
                </div>
                <FlexibleButton text="추천 버디 보러가기" {...BUTTON_STYLES.BLUE} />
            </div>
            <div className={styles.bodyContainer}>
                <div className={styles.left}>
                    <div className={styles.filterContainer}>
                        <h2 className={styles.filterTitle}>Filter</h2>
                        <div className={styles.special}>
                            <h2 className={styles.subTitles}>특화 대상</h2>
                            <div className={styles.checkboxContainer}>
                                <label className={styles.checkboxLabel}>
                                    <input type="checkbox" className={styles.checkboxInput} />
                                    초급자 지도 특화
                                </label>
                            </div>
                            <div className={styles.checkboxContainer}>
                                <label className={styles.checkboxLabel}>
                                    <input type="checkbox" className={styles.checkboxInput} />
                                    중급자 지도 특화
                                </label>
                            </div>
                            <div className={styles.checkboxContainer}>
                                <label className={styles.checkboxLabel}>
                                    <input type="checkbox" className={styles.checkboxInput} />
                                    고급자 지도 특화
                                </label>
                            </div>
                        </div>

                        <div className={styles.level}>
                            <h2 className={styles.subTitles}>버디의 학습 레벨</h2>
                            <label className={styles.checkboxLabel}>
                                <input type="checkbox" className={styles.checkboxInput} />
                                Level 1: 아직 기초 단계예요
                            </label>
                            <label className={styles.checkboxLabel}>
                                <input type="checkbox" className={styles.checkboxInput} />
                                Level 2: 간단한 문장은 이해할 수 있어요
                            </label>
                            <label className={styles.checkboxLabel}>
                                <input type="checkbox" className={styles.checkboxInput} />
                                Level 3: 일상 대화는 가능해요
                            </label>
                            <label className={styles.checkboxLabel}>
                                <input type="checkbox" className={styles.checkboxInput} />
                                Level 4: 복잡한 주제도 말할 수 있어요
                            </label>
                            <label className={styles.checkboxLabel}>
                                <input type="checkbox" className={styles.checkboxInput} />
                                Level 5: 거의 원어민 수준이에요
                            </label>
                        </div>
                        <div className={styles.style}>
                            <h2 className={styles.subTitles}>대화 스타일</h2>
                            <label className={styles.checkboxLabel}>
                                <input type="checkbox" className={styles.checkboxInput} />
                                피드백은 바로바로
                            </label>
                            <label className={styles.checkboxLabel}>
                                <input type="checkbox" className={styles.checkboxInput} />
                                피드백은 한번에
                            </label>
                            <label className={styles.checkboxLabel}>
                                <input type="checkbox" className={styles.checkboxInput} />
                                활발하고 에너지 넘치는
                            </label>
                            <label className={styles.checkboxLabel}>
                                <input type="checkbox" className={styles.checkboxInput} />
                                차분하고 편안한
                            </label>
                        </div>
                        <div className={styles.frequency}>
                            <h2 className={styles.subTitles}>수업 빈도</h2>
                            <label className={styles.checkboxLabel}>
                                <input type="checkbox" className={styles.checkboxInput} />주 1~2회
                            </label>
                            <label className={styles.checkboxLabel}>
                                <input type="checkbox" className={styles.checkboxInput} />주 3~4회 이상
                            </label>
                        </div>
                        <div className={styles.gender}>
                            <h2 className={styles.subTitles}>성별</h2>
                            <label className={styles.checkboxLabel}>
                                <input type="checkbox" className={styles.checkboxInput} />
                                남자
                            </label>
                            <label className={styles.checkboxLabel}>
                                <input type="checkbox" className={styles.checkboxInput} />
                                여자
                            </label>
                            <label className={styles.checkboxLabel}>
                                <input type="checkbox" className={styles.checkboxInput} />
                                기타
                            </label>
                        </div>
                    </div>
                </div>
                <div className={styles.right}>
                    <div className={styles.tabContainer}>
                        <Tab />
                    </div>
                    <div className={styles.profileContainer}>
                        {profiles.map((profile) => (
                            <ProfileImage
                                key={profile.name} // 고유한 키 설정
                                selectedUser={profile} // 각 사용자 데이터를 전달
                                onSelectUser={(user) => {
                                    console.log('Selected User:', user);
                                    setSelectedUser(user); // 사용자 업데이트
                                }}
                                handleChatConnection={() => {
                                    if (selectedUser) {
                                        const chatRoomUrl = `/space/${currentUser.name}/${selectedUser.name}`;
                                        console.log('Redirecting to:', chatRoomUrl);
                                        window.location.href = chatRoomUrl; // 채팅 연결
                                    }
                                }}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
