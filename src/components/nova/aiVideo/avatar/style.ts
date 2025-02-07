import styled from 'styled-components';

export const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 24px;
  padding: 0 16px;
`;

export const AvatarCard = styled.div<{ isCircle: boolean }>`
  width: 248px;
  height: ${({ isCircle }) => (isCircle ? '233px' : '180px')};
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  border: 1px solid #c9cdd2;
  border-radius: 12px;
`;

export const PreviewWrap = styled.div<{ isCircle: boolean }>`
  width: ${({ isCircle }) => (isCircle ? '180px' : '246px')};
  height: ${({ isCircle }) => (isCircle ? '180px' : '141px')};
  display: flex;
  align-items: flex-end;
  justify-content: center;
  background: #e8ebed;
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

export const ContentWrap = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
`;

export const AvatarSelectBox = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
`;

export const TitleWrap = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;

  .title,
  .show {
    font-size: 16px;
    font-weight: 500;
    line-height: 24px;
    color: #454c53;
  }

  .show {
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

export const ButtonWrap = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
`;

export const AvartarList = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: repeat(4, 76px);
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: 8px;
  box-sizing: border-box;
`;

export const AvartarContainer = styled.div<{ isSelected: boolean }>`
  width: 76px;
  height: 76px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const OuterBorder = styled.div<{ isSelected: boolean }>`
  display: ${(props) => (props.isSelected ? 'flex' : 'none')};
  width: 76px;
  height: 76px;
  position: absolute;
  border: 2px solid #6f3ad0;
  border-radius: 6px;
  pointer-events: none;
  z-index: 1;
`;

export const Image = styled.img`
  width: 76px;
  height: 76px;
  border: 1.27px solid #e8ebed;
  border-radius: 4px;
  object-fit: cover;
  cursor: pointer;
`;

export const CheckBox = styled.div`
  width: 20px;
  height: 20px;
  position: absolute;
  top: 2px;
  left: 2px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #6f3ad0;
  border-bottom-right-radius: 8px;
`;

export const UploadInner = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12.5px 0;
`;

export const ImageUploadGuide = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;

  .title {
    font-size: 14px;
    font-weight: 500;
    line-height: 21px;
    color: #454c53;
  }
  .desc {
    font-size: 12px;
    font-weight: 500;
    line-height: 18px;
    color: #9ea4aa;
  }
`;

export const CreditInfo = styled.div`
  width: 37px;
  position: absolute;
  right: 16px;
  display: flex;
  gap: 0.5px;

  img {
    width: 20px;
    height: 20px;
  }

  span {
    width: 15px;
    font-size: 14px;
    font-weight: 500;
    line-height: 21px;
  }
`;
