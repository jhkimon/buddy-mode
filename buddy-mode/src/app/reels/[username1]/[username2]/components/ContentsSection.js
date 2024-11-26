import Image from 'next/image';
import styled from 'styled-components';
import FlexibleButton from '@/app/components/common/button';
import { faDownload, faVideo } from '@fortawesome/free-solid-svg-icons';
import { BUTTON_STYLES } from '@/constants/buttonStyles';

const StyledImage = styled(Image)`
    object-fit: cover;
    padding: 5px 0px;
`;

const ContentsSectionContainer = styled.div`
    background-color: rgba(174, 172, 242, 0.1);
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
    width: 750px;
    height: 450px;
    padding: 40px;
    border-radius: 20px;
    display: flex;
    flex-direction: column;
    border: 1px solid #4139fb;
`;

const HeadContainer = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
`;

const MyContents = styled.div`
    font-family: 'Paperlogy', sans-serif;
    font-size: 16px;
    font-weight: bold;
    margin: 0;
    color: #4139fb;
`;

export default function ContentsSection({ handleVideoChat }) {
    return (
        <ContentsSectionContainer>
            <HeadContainer>
                <MyContents>릴스: 올리브영에서 물건 찾고 계산하기</MyContents>
                <FlexibleButton text="교재 PDF로 저장하기" icon={faDownload} {...BUTTON_STYLES.WHITE} width="170px" />
            </HeadContainer>
            <StyledImage src="/images/reels-shot.png" alt="버디 모드" objectFit="cover" width={500} height={400} />
            <FlexibleButton
                text="수업 시작하기"
                onClick={handleVideoChat}
                icon={faVideo}
                {...BUTTON_STYLES.BLUE_LARGE}
            />
        </ContentsSectionContainer>
    );
}
