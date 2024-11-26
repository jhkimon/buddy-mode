'use client';

import React, { useState } from 'react';
import styled from 'styled-components';
import { COLORS } from '@/constants/colors';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';

const Link = styled.a.withConfig({
    shouldForwardProp: (prop) => prop !== 'isActive',
})`
    font-size: 12px;
    color: ${(props) => (props.isActive ? COLORS.BLUE : '#000000')};
    text-decoration: none;

    &:hover {
        color: ${COLORS.BLUE};
    }
`;

const GNBContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    background-color: #ffffff;
    padding: 0 25px;
    height: 60px;
    color: white;
    font-weight: 600;
`;

const LeftSection = styled.div`
    display: flex;
    align-items: center;
    gap: 20px;
`;

const CenterSection = styled.div`
    display: flex;
    align-items: center;
    width: 60%;
    gap: 10%;
`;

const RightSection = styled.div`
    display: flex;
    align-items: center;
    gap: 5px;
    color: #000000;
    font-size: 12px;
`;

const GNB = () => {
    const [activetab, setActivetab] = useState(0);

    return (
        <GNBContainer>
            <LeftSection>
                <Link href="/">
                    <img src="/images/icon_brand.png" alt="Brand Icon"      />
                </Link>
            </LeftSection>
            <CenterSection>
                <Link href="#buddy" isActive={activetab === 0} onClick={() => setActivetab(0)}>
                    BUDDY
                </Link>
                <Link href="#faq" isActive={activetab === 1} onClick={() => setActivetab(1)}>
                    이용 안내
                </Link>
                <Link href="#feedback" isActive={activetab === 2} onClick={() => setActivetab(2)}>
                    버디 피드백
                </Link>
                <Link href="#guide" isActive={activetab === 3} onClick={() => setActivetab(3)}>
                    이용 가이드
                </Link>
            </CenterSection>
            <RightSection>
                <img src="/images/icon_mypage.png" alt="My Page Icon" />
                <div>마이 페이지</div>
                <FontAwesomeIcon icon={faChevronDown}></FontAwesomeIcon>
            </RightSection>
        </GNBContainer>
    );
};

export default GNB;
