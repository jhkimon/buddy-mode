'use client';

import React from 'react';
import styled from 'styled-components';

const DivWrapper = styled.div`
    background: ${(props) => props.$bgColor};
    color: ${(props) => props.$textColor};
    padding: 8px 10px;
    border-radius: 4px;
    font-size: 14px;
    font-weight: bold;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    height: auto;
    width: auto;
    min-width: 50px;
    max-width: 120px;
    transition: background 0.3s, transform 0.2s;
`;

const BuddyCard = ({ text, bgColor = '#3f3d7f', textColor = '#ffffff' }) => {
    return (
        <DivWrapper $bgColor={bgColor} $textColor={textColor}>
            {text}
        </DivWrapper>
    );
};

export default BuddyCard;
