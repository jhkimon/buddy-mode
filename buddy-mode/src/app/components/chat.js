'use client';

import React from 'react';
import styled from 'styled-components';
import { COLORS } from '@/constants/colors';

const ChatBox = styled.div`
    background-color: ${(props) => (props.$styleType === 'MY' ? COLORS.CHAT_MY : COLORS.CHAT_BUDDY)};
    color: #000000;
    border-radius: 12px;
    padding: 10px 15px;
    font-size: 14px;
    font-weight: 400;
    display: flex;
    flex-direction: column;
    gap: 8px;
    box-shadow: ${(props) => (props.$styleType === 'BUDDY' ? '0 1px 3px rgba(0, 0, 0, 0.1)' : 'none')};
    max-width: 250px;
    width: auto; /* 텍스트 내용에 따라 너비 조정 */
    display: inline-block;
    word-break: break-word;
    margin-left: ${(props) => (props.$styleType === 'MY' ? 'auto' : '0')}; /* 내 메시지는 오른쪽 정렬 */
    margin-right: ${(props) => (props.$styleType === 'MY' ? '0' : 'auto')}; /* 상대방 메시지는 왼쪽 정렬 */    width: auto; /* 텍스트 크기에 맞게 조정 */
`;

const TranslateButton = styled.button`
    align-self: ${(props) => (props.$styleType === 'MY' ? 'flex-start' : 'flex-end')};
    background: none;
    border: none;
    color: #6b7280;
    font-size: 12px;
    cursor: pointer;
    font-family: 'Paperlogy';
    text-decoration: underline;
    padding: 0;
    margin-top: 4px;
    text-align: center;
`;

const Chat = ({ text, styleType = 'my', onTranslate }) => {
    return (
        <ChatBox $styleType={styleType}>
            {text}
            <br/>
            <TranslateButton onClick={onTranslate} $styleType={styleType}>
                번역하기
            </TranslateButton>
        </ChatBox>
    );
};

export default Chat;
