import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export const Image = styled.img`
    padding-right: ${(props) => props.theme.spacing.md};
`;

export const HeaderContainer = styled.header`
    flex: 0 0 17px;
    margin: 1rem;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    gap: ${(props) => props.theme.spacing.sm};
    color: ${(props) => props.theme.colors.text};
    font-size: 12px;
    font-weight: regular;
`;

export const Header = ({ message }) => (
    <HeaderContainer>
        <Image src="/images/icon_brand.png" alt="Brand Icon" />
        {message.text1 && (
            <>
                {/* 아이콘 1과 텍스트 1 */}
                <FontAwesomeIcon icon={message.icon1} />
                <span>{message.text1}</span>
            </>
        )}
        {message.text2 && (
            <>
                {/* 아이콘 2와 텍스트 2 */}
                <FontAwesomeIcon icon={message.icon2} />
                <span>{message.text2}</span>
            </>
        )}
    </HeaderContainer>
);
