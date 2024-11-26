'use client';

import React from 'react';
import styled from 'styled-components';
import FlexibleButton from './common/button';
import { faArrowPointer } from '@fortawesome/free-solid-svg-icons';
import { BUTTON_STYLES } from '@/constants/buttonStyles';
import BuddyCard from './common/buddyCard';
import { BUDDY_CARD_STYLES } from '@/constants/buddyCardStyles';

const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;
    width: 85%;
    padding: 16px;
`;

const ProfileSection = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    width: 100%;
`;

const ProfileContainer = styled.div`
    display: flex;
    align-items: center;
    gap: 16px;
`;

const ProfileImg = styled.img`
    width: 50px;
    height: 50px;
    border-radius: 8px;
    object-fit: cover;
`;

const ProfileInfo = styled.div`
    display: flex;
    flex-direction: column;
`;

const ProfileName = styled.h2`
    margin: 0;
    font-size: 20px;
    font-weight: bold;
`;

const ProfileLocation = styled.p`
    margin: 0;
    color: #555;
    font-size: 10px;
`;

const StyledButton = styled(FlexibleButton)`
    margin-left: auto;
`;

const PreviewSection = styled.div`
    display: flex;
    gap: 8px;
    justify-content: flex-start;
    flex-wrap: nowrap;
    width: 100%;
`;

const TreeImg = styled.img`
    width: 100px;
    height: 100px;
    object-fit: cover;
    border-radius: 8px;
`;

const PreviewImg = styled.img`
    width: 180px;
    height: 100px;
    object-fit: cover;
    border-radius: 8px;
`;

const BuddyCardSection = styled.div`
    display: flex;
    gap: 8px;
    justify-content: flex-start;
    width: 100%;
            
`;

const ProfileImage = ({ selectedUser, onSelectUser, handleChatConnection }) => {
    return (
        <Container>
            {/* 프로필 섹션 */}
            <ProfileSection>
                <ProfileContainer>
                    <ProfileImg src="/images/profile.png" alt="Profile" />
                    <ProfileInfo>
                        <ProfileName>{selectedUser?.name || "사용자 이름"}</ProfileName>
                        <ProfileLocation>Japan</ProfileLocation>
                    </ProfileInfo>
                </ProfileContainer>
                <StyledButton
                        text="첫 만남 요청하기"
                        onClick={() => {
                        console.log("버튼 클릭 이벤트 실행");
                        if (onSelectUser) onSelectUser(selectedUser); // 사용자 선택
                        if (handleChatConnection) handleChatConnection();
                        }}
                        icon={faArrowPointer}
                        {...BUTTON_STYLES.PURPLE_LARGE}
                        />            
            </ProfileSection>

            {/* 이미지 미리보기 섹션 */}
            <PreviewSection>
                <TreeImg src="/images/tree.png" alt="Tree" />
                <PreviewImg src="/images/preview1.png" alt="preview1" />
                <PreviewImg src="/images/preview2.png" alt="preview2" />
                <PreviewImg src="/images/preview3.png" alt="preview3" />
            </PreviewSection>

            {/* BuddyCard 섹션 */}
            <BuddyCardSection>
                <BuddyCard text="초급자 지도 특화" {...BUDDY_CARD_STYLES.BUDDY} />
                <BuddyCard text="Level 1" {...BUDDY_CARD_STYLES.LEVEL} />
                <BuddyCard text="피드백은 한번에" {...BUDDY_CARD_STYLES.FEEDBACK} />
                <BuddyCard text="차분하고 편안한" {...BUDDY_CARD_STYLES.MOOD} />
                <BuddyCard text="주 1~2회" {...BUDDY_CARD_STYLES.WEEK} />
            </BuddyCardSection>
        </Container>
    );
};

export default ProfileImage;
