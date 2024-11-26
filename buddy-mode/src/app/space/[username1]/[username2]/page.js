"use client";

import { useEffect, useState } from "react";
import { addMessage, listenToMessages } from "../../../utils/firebaseHelpers";
import Chat from "../../../components/chat";
import DesignPage from "@/app/components/page";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowPointer, faBook, faVideo,faPaperPlane, faArrowRight,faStore } from '@fortawesome/free-solid-svg-icons';
import { BUTTON_STYLES } from "@/constants/buttonStyles";
import GNB from "../../../components/common/gnb"; // GNB 가져오기
import FlexibleButton from "../../../components/common/button"
import { CHAT_STYLES } from "../../../../constants/chatStyles";
import styles from "./space.module.css";
import Image from 'next/image';

export default function ChatPage({ params }) {
    const [username1, setUsername1] = useState(null);
    const [username2, setUsername2] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [roomId, setRoomId] = useState("");

    // params 언래핑 및 디코딩
    useEffect(() => {
        const unwrapParams = async () => {
            const resolvedParams = await params;
            const decodedUsername1 = decodeURIComponent(resolvedParams.username1);
            const decodedUsername2 = decodeURIComponent(resolvedParams.username2);

            setUsername1(decodedUsername1);
            setUsername2(decodedUsername2);

            // 방 ID 생성
            const generatedRoomId = [decodedUsername1, decodedUsername2].sort().join("_");
            setRoomId(generatedRoomId);
        };

        unwrapParams();
    }, [params]);

    // 메시지 리스너 등록
    useEffect(() => {
        if (roomId) {
            const unsubscribe = listenToMessages(roomId, (fetchedMessages) => {
                setMessages(fetchedMessages);
            });

            return () => unsubscribe(); // 컴포넌트 언마운트 시 리스너 제거
        }
    }, [roomId]);
     // 나의 메시지인지 상대방 메시지인지 스타일 결정
     const getMessageStyle = (sender) => {
        return sender === username1 ? { container: "myMessage", type: "MY" } : { container: "buddyMessage", type: "BUDDY" };
    };

    // 메시지 전송 핸들러
    const handleSendMessage = async () => {
        if (!newMessage.trim()) return;

        await addMessage(roomId, username1, newMessage);
        setNewMessage(""); // 입력창 초기화
    };

    // 메시지 번역 핸들러
    const handleTranslate = (message) => {
        alert(`번역된 메시지: ${message}`);
    };

    // 화상 채팅 이동 핸들러
    const handleVideoChat = () => {
        window.location.href = `/video/${encodeURIComponent(username1)}/${encodeURIComponent(username2)}`;
    };

    return (
        <div>
            {/* GNB 추가 */}
            <GNB />
            <div className={styles.bannerContainer}>
                <Image
                    src="/images/banner.png" // public/banner.jpg 경로
                    alt="배너 이미지"
                    width= {1440} /* 부모 너비에 맞게 조정 */
                    height= {240}/* 비율 유지 */
                    className={styles.bannerImage} // CSS로 스타일 조정
                />
            </div>
            <div className={styles.bannerText}>
                <div className={styles.bannerText1}>
                    버디 스페이스
                </div>
                <div className={styles.bannerText2}>
                    나의 버디와 공부하고 추억을 쌓는 공간
                </div>
            </div>
            <div className={styles.contentContainer}>   
                <div className={styles.buddySection}>
                    <div className={styles.mybuddy}>나의 버디</div>
                    <div className={styles.profile}>
                        <Image
                            src="/images/profile.png"
                            alt="Profile Picture"
                            width={80}
                            height={80}
                            className={styles.profileImage} // 스타일 추가
                        />
                        <div className={styles.buddyInfo}>
                            <p className={styles.buddyName}>{username2}</p>
                            <p className={styles.buddyCountry}>Japan</p>
                        </div>
                    </div>
                    <FlexibleButton text="프로필 보기" className={styles.lookprofile} icon={faArrowPointer} {...BUTTON_STYLES.PURPLE} width="100%" />
                    <Image
                        src="/images/calendar.png"
                        alt="Calendar"
                        width={201}
                        height={169}
                        className={styles.calendar} // 스타일 추가
                    />
                    <div className={styles.schedule}>
                        <Image src="/images/check-square.png" alt="checksquare" width={14} height={14}/>
                        오늘 오후 6시, 수업이 예약돼 있어요!
                    </div>
                    <div className={styles.buttons}>
                        <FlexibleButton text="오늘의 교재 확인하기" icon={faBook} {...BUTTON_STYLES.PURPLE} width="100%"/>
                        <FlexibleButton text="교재 둘러보기" icon={faBook} {...BUTTON_STYLES.WHITE} width="100%"/>
                        <FlexibleButton text="수업 시작하기" onClick={handleVideoChat} icon={faVideo} {...BUTTON_STYLES.BLUE} width="100%"/>
                    </div>
                </div>
                <div className={styles.chatBackground}>
                    {/* 메시지 목록 */}
                    <div className={styles.chatContainer}>
                        {messages.map((msg, index) => {
                            const messageStyle = getMessageStyle(msg.sender);
                        return (
                            <div key={index} className={styles[messageStyle.container]}>
                                <Chat
                                     text={msg.content}
                                     styleType={messageStyle.type}
                                />
                            </div>
                         );
                        })}
                    </div>
                    {/* 메시지 입력 */}
                    <div className={styles.chatInputContainer}>
                        <input
                            type="text"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    handleSendMessage();
                                }
                            }}
                            placeholder="메시지를 입력하세요"
                            className={styles.chatInput}
                        />
                    </div>
                </div>
                 <div className={styles.buddyForestSection}>
                    <div className={styles.buddyForest}>
                        <div className={styles.forestText}>버디 포레스트
                            <Image src="/images/share.png" className={styles.share} alt="share" width={19} height={19}/>
                        </div>
                        <Image src="/images/forest.png" className={styles.forestImg} alt="forest" width={199} height={199}/>
                    </div>
                    <div className={styles.forestShop}>
                        <div className={styles.forestshopText}>버디 스페이스 꾸미기</div>
                        <div className={styles.shopText1}>
                            <Image src="/images/leaf.png" className={styles.share} alt="share" width={13} height={13}/>Class Streak으로 아이템을 구매해서 채팅
                        </div>
                        <div className={styles.shopText2}>
                            <p>창과 버디포레스트를 꾸며 보세요!</p>
                        </div>
                        <Image src="/images/Online Shop.png" className={styles.onlineShop} alt="forest" width={90} height={90}/>
                        <div className={styles.shopButton}>
                            <FlexibleButton text="상점 들어가기" icon={faStore} {...BUTTON_STYLES.BLUE_LARGE} width="80%" onClick={() => alert("준비중입니다!")} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
