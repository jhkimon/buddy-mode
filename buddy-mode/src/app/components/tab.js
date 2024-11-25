'use client';

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { COLORS } from '@/style/colors';

const Content = styled.div.withConfig({
    shouldForwardProp: (prop) => prop !== 'istabActive',
})`
    margin: 0 20px;
    cursor: pointer;
    color: ${(props) => (props.istabActive ? COLORS.BLUE : 'black')};
    font-weight: ${(props) => (props.istabActive ? '600' : '400')};

    &:hover {
        color: ${COLORS.BLUE};
    }
`;

const TabContainer = styled.div.withConfig({
    shouldForwardProp: (prop) => prop !== 'activetab',
})`
    display: flex;
    align-items: center;
    font-size: 12px;
    justify-content: space-around;
    background-color: #ffffff;
    padding: 0 20px;
    height: 60px;
    color: black;
    border-bottom: 1px solid black;
    position: relative;

    /* Pseudo-element for the active section background color */
    ::after {
        content: '';
        position: absolute;
        bottom: 0;
        left: ${(props) => (props.activetab === 0 ? '0' : props.activetab === 1 ? '33.33%' : '66.66%')};
        width: 33.33%;
        height: 2px;
        background-color: ${COLORS.BLUE};
        transition: left 0.3s ease-in-out;
    }
`;

const Tab = () => {
    const [activetab, setActivetab] = useState(null);

    useEffect(() => {
        setActivetab(0);
    }, []);

    if (activetab === null) return null;

    return (
        <TabContainer activetab={activetab}>
            <Content istabActive={activetab === 0} onClick={() => setActivetab(0)}>
                새롭게 등록한 버디
            </Content>
            <Content istabActive={activetab === 1} onClick={() => setActivetab(1)}>
                선호 시간이 비슷한 버디
            </Content>
            <Content istabActive={activetab === 2} onClick={() => setActivetab(2)}>
                내가 즐겨찾기한 버디
            </Content>
        </TabContainer>
    );
};

export default Tab;
