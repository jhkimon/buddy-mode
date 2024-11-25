import styled from 'styled-components';

export const Container = styled.div`
    display: flex;
    flex-direction: column;
    height: 100vh;
    width: 100vw;
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    overflow: hidden;
    background-color: ${(props) => props.theme.colors.black};
`;

export const ContentWrapper = styled.div`
    flex: 1;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    padding-left: ${(props) => props.theme.spacing.lg};
    overflow: hidden;
`;

export const VideoWrapper = styled.div`
    display: flex;
    flex-direction: column;
    gap: ${(props) => props.theme.spacing.md};
    width: 430px;
`;

export const SharedContent = styled.div`
    width: 430px;
    background-color: ${(props) => props.theme.colors.sharedBg};

    @media (max-width: 800px) {
        display: none;
    }
`;
