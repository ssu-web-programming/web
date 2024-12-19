import styled from 'styled-components';

const Wrapper = styled.div`
  width: 100%;
  min-width: 295px;
  height: 100%;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  border-top: 1px solid ${({ theme }) => theme.color.borderGray01};
  overflow: hidden;
`;

const Navi = styled.div`
  width: 100%;
  height: 56px;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  gap: 4px;

  border-bottom: 1px solid ${({ theme }) => theme.color.borderGray01};
  padding: 16px;
  font-weight: 600;
  font-size: 14px;
  line-height: 21px;

  svg {
    width: 16px;
    height: 16px;
  }

  .currentDir {
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }
`;

const FileList = styled.div`
  width: 100%;

  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden auto;
  position: relative;
`;

const FileItem = styled.div`
  width: 100%;
  min-width: 247px;
  height: 68px;
  min-height: 68px;

  display: flex;
  flex-direction: row;

  justify-content: flex-start;
  align-items: center;

  & + & {
    border-top: 1px solid ${({ theme }) => theme.color.borderGray02};
  }

  .icon {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .info {
    width: 100%;
    overflow: hidden;
    margin-left: 10px;

    .name {
      font-weight: 400;
      font-size: 16px;
      letter-spacing: -0.02em;

      margin-bottom: 4px;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
    }

    .createdAt {
      font-weight: 400;
      font-size: 12px;
      color: var(--gray-gray-60-03);

      svg {
        margin-left: 8px;
      }
    }
  }
`;

const NoFile = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 12px;

  span {
    color: var(--gray-gray-60-03);
    font-size: 14px;
    line-height: 21px;
    text-align: center;
  }
`;

const SubTitle = styled.div`
  font-size: 14px;
  line-height: 16px;
  color: ${({ theme }) => theme.color.text.highlightText};
  text-align: center;
  background-color: ${({ theme }) => theme.color.mainBg};
  padding: 6px 0;
`;

const ItemWrapper = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  align-items: center;
  padding: 22px 24px;
  cursor: pointer;
`;

const SpinnerWrapper = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

export { FileItem, FileList, ItemWrapper, Navi, NoFile, SpinnerWrapper, SubTitle, Wrapper };
