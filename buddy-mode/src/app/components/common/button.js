'use client';

import React from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

// 버튼 스타일
const ButtonWrapper = styled.button`
    background: ${(props) => (props.$isOutlined ? 'transparent' : props.$bgColor)};
    color: ${(props) => props.$textColor};
    border: ${(props) => (props.$isOutlined ? `0.5px solid ${props.borderColor || props.$textColor}` : 'none')};
    padding: 10px 20px;
    border-radius: 8px;
    font-size: 12px;
    font-weight: medium;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    width: ${(props) => props.$width};
    height: 32px;
    transition: background 0.3s, transform 0.2s;

    &:hover {
        transform: scale(1.03);
    }
`;

const FlexibleButton = ({
    text,
    icon,
    bgColor = '#3f3d7f',
    textColor = '#ffffff',
    borderColor,
    isOutlined = false,
    onClick,
    width,
}) => {
    return (
        <ButtonWrapper
            $bgColor={bgColor}
            $textColor={textColor}
            borderColor={borderColor}
            $isOutlined={isOutlined}
            onClick={onClick}
            $width={width}
        >
            {icon && <FontAwesomeIcon icon={icon} />}
            {text}
        </ButtonWrapper>
    );
};

export default FlexibleButton;
