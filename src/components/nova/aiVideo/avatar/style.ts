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
  top: 1px;
  left: 1px;
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
