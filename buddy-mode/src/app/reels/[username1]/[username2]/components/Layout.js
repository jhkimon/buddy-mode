import styled from 'styled-components';

export const Container = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    height: 100vh;
    width: 100vw;
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    overflow: hidden;
    background-color: #ffffff;
`;

export const Wrapper = styled.div`
    display: flex;
    justify-content: flex-start;
    align-items: flex-start;
    padding-left: 250px;
    margin-top: 30px;
    overflow: hidden;
    gap: 40px;
`;

export const ContentWrapper = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    overflow: hidden;
`;
