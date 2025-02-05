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

export const AvatarCard = styled.div`
  width: 248px;
  height: 180px;
  background: #e8ebed;
  border: 1px solid #c9cdd2;
  border-radius: 12px;
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

  span {
    font-size: 16px;
    font-weight: 500;
    line-height: 24px;
    color: #454c53;
  }
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
