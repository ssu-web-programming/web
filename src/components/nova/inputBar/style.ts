import styled, { css } from 'styled-components';

export const InputBarBase = styled.div<{ disabled: boolean }>`
  position: relative;
  width: 100%;
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
  border-top: ${({ theme }) => (theme.mode === 'dark' ? '1px solid var(--gray-gray-87)' : 'none')};
  box-shadow: ${({ theme }) =>
    theme.mode === 'light' ? '0px -4px 8px 0px var(--gray-shadow-light)' : 'none'};
  background-color: ${({ theme }) =>
    theme.mode === 'light' ? theme.color.subBgGray01 : 'transparent'};

  ${({ disabled }) =>
    disabled &&
    css`
      pointer-events: none;
      opacity: 0.5;
    `}
`;

export const FileListViewer = styled.div`
  width: 100%;
  padding: 8px 16px 0 16px;
  display: flex;
  gap: 8px;
  overflow-x: scroll;
  white-space: nowrap;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }
`;

export const ClipboardItem = styled.div`
  width: fit-content;
  position: relative;
  display: flex;
  align-items: center;
  border-radius: 8px;
  background: ${({ theme }) => theme.color.subBgGray04};
  color: ${({ theme }) => theme.color.text.subGray04};

  font-size: 16px;
  line-height: 21px;
  text-align: left;

  .uploading {
    font-weight: 700;
    color: #6f3ad0;
  }

  svg {
    position: absolute;
    top: -4px;
    right: -4px;
  }

  & > img {
    border-radius: 12px;
    border: 1px solid #c9cdd2;
  }
`;

export const FileItem = styled.div`
  width: fit-content;
  height: 48px;
  position: relative;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px;
  border-radius: 8px;
  background: ${({ theme }) => theme.color.subBgGray04};
  color: ${({ theme }) => theme.color.text.subGray04};

  font-size: 16px;
  line-height: 21px;
  text-align: left;

  .uploading {
    font-weight: 700;
    color: #6f3ad0;
  }

  svg {
    position: absolute;
    top: -4px;
    right: -4px;
  }
`;

export const InputTxtWrapper = styled.div<{ hasValue: boolean }>`
  width: 100%;
  min-height: 40px;
  height: auto;
  padding: 6px 12px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const PromptWrap = styled.div`
  .swiper-slide {
    width: fit-content;
    padding: 8px 16px;
    background-color: var(--gray-gray-10);
    border-radius: 8px;
    font-size: 13px;
    font-weight: 400;
    line-height: 19.5px;
    color: var(--gray-gray-80-02);
    cursor: pointer;
  }

  .swiper-pagination {
    display: none;
  }
`;

export const InputWrap = styled.div`
  width: 100%;
  height: 48px;
  display: flex;
`;

export const TextAreaWrap = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border: 1px solid var(--gray-gray-40);
  border-radius: 24px;
`;

export const TextArea = styled.textarea<{ value: string }>`
  display: flex;
  width: 100%;
  height: 40px;
  padding: 0;
  box-sizing: border-box;
  outline: none;
  border-radius: 3px;
  border-style: solid;
  border-width: 10px 6px 10px 16px;
  border-color: transparent;
  resize: none;
  word-break: break-all;
  font-size: 14px;
  line-height: 20px;
  z-index: 2;
  color: ${({ theme }) => theme.color.text.subGray04};
  background-color: transparent;

  &::placeholder {
    color: ${({ value }) => (value ? 'transparent' : '#aaa')};
  }

  @media screen and (orientation: portrait) {
    /* 세로 모드 스타일 */
    max-height: 140px;
  }

  @media screen and (orientation: landscape) {
    /* 가로 모드 스타일 */
    max-height: 60px;
  }
`;

export const ButtonWrap = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 16px;
`;

export const DocButtonWrap = styled.div`
  display: flex;
  gap: 8px;
`;
