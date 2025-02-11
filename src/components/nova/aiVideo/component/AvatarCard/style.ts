import styled from 'styled-components';

export const AvatarCard = styled.div<{ isCircle: boolean }>`
  width: 248px;
  height: ${({ isCircle }) => (isCircle ? '233px' : '180px')};
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border: 1px solid #c9cdd2;
  border-radius: 12px;

  .logo {
    position: absolute;
    top: 12px;
    left: 12px;
  }
`;

export const PreviewWrap = styled.div<{ isCircle: boolean; bgColor: string }>`
  width: ${({ isCircle }) => (isCircle ? '180px' : '246px')};
  height: ${({ isCircle }) => (isCircle ? '180px' : '142px')};
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ bgColor }) => bgColor};
  border-radius: ${({ isCircle }) => (isCircle ? '99px' : '12px 12px 0 0')};

  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    border-radius: ${({ isCircle }) => (isCircle ? '99px' : '12px 12px 0 0')};
  }
`;

export const AvatarInfo = styled.div`
  height: 37px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background-color: transparent;

  .name {
    font-size: 14px;
    font-weight: 500;
    line-height: 21px;
    color: ${({ theme }) => theme.color.text.gray03};
  }

  .etc {
    font-size: 13px;
    font-weight: 500;
    line-height: 19.5px;
    color: ${({ theme }) => theme.color.text.gray07};
  }
`;
