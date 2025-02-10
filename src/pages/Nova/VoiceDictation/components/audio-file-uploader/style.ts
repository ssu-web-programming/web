import styled from 'styled-components';

const Wrap = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  height: 114px;
  padding: 16px;
  border-radius: 8px;
  background-color: ${({ theme }) => theme.color.background.gray01};
  border: 1px dashed ${({ theme }) => theme.color.border.gray01};
`;

const ImageBox = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 12px;
`;

const Icon = styled.div<{ disable: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  svg {
    width: 32px;
    height: 32px;

    cursor: ${(props) => (props.disable ? 'initial' : 'pointer')};
    color: ${(props) => (props.disable ? '#454c5380' : 'var(--gray-gray-80-02)')};
  }

  span {
    font-size: 16px;
    font-weight: 700;
    line-height: 24px;
    color: ${({ theme }) => theme.color.text.subGray03};
  }
`;

const Credit = styled.div`
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  border-radius: 999px;

  .img {
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  span {
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
    font-weight: 400;
    padding-bottom: 2px;
    color: ${({ theme }) => theme.color.text.gray04};
  }
`;

const Guide = styled.div`
  font-size: 14px;
  font-weight: 400;
  line-height: 21px;
  white-space: pre-wrap;
  text-align: left;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const GuideTitle = styled.p`
  font-weight: 700;
  font-size: 16px;
  line-height: 24px;
`;

const GuideSubTitle = styled.p`
  font-weight: 400;
  font-size: 12px;
  line-height: 18px;
  color: #72787f;
`;

export { Credit, Guide, GuideSubTitle, GuideTitle, Icon, ImageBox, Wrap };
