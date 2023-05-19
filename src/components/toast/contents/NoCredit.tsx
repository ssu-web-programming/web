import styled from 'styled-components';

const TextLink = styled.p`
  &:hover {
    cursor: pointer;
  }
`;

export default function NoCredit() {
  return (
    <div>
      <p>보유하신 크레딧을 모두 사용하셨습니다.</p>
      <TextLink
        onClick={() => {
          window._Bridge.openWindow(`credit`);
        }}>{`크레딧 정책 확인하기 >`}</TextLink>
    </div>
  );
}
