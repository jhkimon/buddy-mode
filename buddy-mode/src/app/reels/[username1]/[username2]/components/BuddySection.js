import styled from 'styled-components';

const BuddySectionContainer = styled.div`
    background-color: rgba(174, 172, 242, 0.1);
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
    width: 267px;
    height: 50%;
    padding: 20px;
    margin-top: 20px;
    display: flex;
    flex-direction: column;
`;

const MyBuddy = styled.div`
    font-family: 'Paperlogy', sans-serif;
    font-size: 16px;
    font-weight: bold;
`;

const ReelsContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 20px;
    padding: 10px;
`;

const BuddyInfo = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
`;

const BuddyName = styled.p`
    font-family: 'Paperlogy', sans-serif;
    font-size: 14px;
    font-weight: bold;
    margin: 0;
    color: #4139fb;
`;

const BuddyItem = styled.p`
    font-family: 'Pretendard', sans-serif;
    font-size: 11px;
    color: #39355f;
    margin-top: 8px;
    text-decoration: underline;
    &:hover {
        cursor: pointer;
    }
`;

export default function BuddySection() {
    return (
        <BuddySectionContainer>
            <MyBuddy>오늘의 교재</MyBuddy>
            <ReelsContainer>
                <BuddyInfo>
                    <BuddyName>나의 교재</BuddyName>
                    <BuddyItem>- 밸런스 게임: 카페를 즐기는 방식</BuddyItem>
                    <BuddyItem>- 릴스: 영국 카페에서 오렌지 주스 주문하기</BuddyItem>
                </BuddyInfo>
                <BuddyInfo>
                    <BuddyName>버디의 교재</BuddyName>
                    <BuddyItem>- Would you rather: How to enjoy cafe</BuddyItem>
                    <BuddyItem style={{ fontWeight: 'bold' }}>- 릴스: 올리브영에서 물건 찾고 계산하기</BuddyItem>
                </BuddyInfo>
            </ReelsContainer>
        </BuddySectionContainer>
    );
}
