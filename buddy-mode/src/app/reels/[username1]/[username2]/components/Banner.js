import Image from 'next/image';
import styled from 'styled-components';

const BannerContainer = styled.div`
    position: relative;
    width: 100%;
    height: 240px;
    overflow: hidden;
`;

const StyledImage = styled(Image)`
    object-fit: cover;
`;

const BannerText = styled.div`
    position: absolute;
    left: 250px;
    top: 50%;
    transform: translateY(-50%);
    display: flex;
    flex-direction: column;
    align-items: flex-start;
`;

const BannerText1 = styled.div`
    font-family: 'Chab', sans-serif;
    font-size: 64px;
    color: #e7ff86;
    text-align: left;
`;

const BannerText2 = styled.div`
    font-family: 'Paperlogy', sans-serif;
    font-size: 20px;
    font-weight: 600;
    color: #4139fb;
    text-align: left;
`;

export default function Banner() {
    return (
        <BannerContainer>
            <StyledImage src="/images/banner-reels.png" alt="버디 모드" layout="fill" objectFit="cover" />
            <BannerText>
                <BannerText1>버디 모드</BannerText1>
                <BannerText2>글로벌 친구가 선생님이 되는 순간</BannerText2>
            </BannerText>
        </BannerContainer>
    );
}
