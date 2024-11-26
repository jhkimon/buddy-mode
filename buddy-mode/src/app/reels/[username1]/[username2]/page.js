'use client';

import { useEffect, useState } from 'react';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { BUTTON_STYLES } from '@/constants/buttonStyles';
import GNB from '@/app/components/common/gnb';
import FlexibleButton from '@/app/components/common/button';
import Banner from './components/Banner';
import BuddySection from './components/BuddySection';
import ContentsSection from './components/ContentsSection';
import { Container, Wrapper, ContentWrapper } from './components/Layout';

export default function ReelsPage({ params }) {
    const [username1, setUsername1] = useState(null);
    const [username2, setUsername2] = useState(null);
    const [roomId, setRoomId] = useState(null);

    useEffect(() => {
        const unwrapParams = async () => {
            const resolvedParams = await params;
            const decodedUsername1 = decodeURIComponent(resolvedParams.username1);
            const decodedUsername2 = decodeURIComponent(resolvedParams.username2);

            setUsername1(decodedUsername1);
            setUsername2(decodedUsername2);

            // 방 ID 생성
            const generatedRoomId = [decodedUsername1, decodedUsername2].sort().join('_');
            setRoomId(generatedRoomId);
        };

        unwrapParams();
    }, [params]);

    const handleClickBack = () => {
        window.location.href = `/space/${encodeURIComponent(username1)}/${encodeURIComponent(username2)}`;
    };

    // 화상 채팅 이동 핸들러
    const handleVideoChat = () => {
        window.location.href = `/video/${encodeURIComponent(username1)}/${encodeURIComponent(username2)}`;
    };

    

    return (
        <Container>
            <GNB />
            <Banner />
            <Wrapper>
                <ContentWrapper>
                    <FlexibleButton
                        text="버디 스페이스로 돌아가기"
                        onClick={handleClickBack}
                        icon={faArrowLeft}
                        {...BUTTON_STYLES.WHITE_LARGE}
                    />
                    <BuddySection />
                </ContentWrapper>
                <ContentsSection handleVideoChat={handleVideoChat} />
            </Wrapper>
        </Container>
    );
}
