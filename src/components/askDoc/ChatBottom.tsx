import TextArea from '../TextArea';
import { INPUT_MAX_LENGTH } from '../../store/slices/askDoc';
import SendCoinButton from '../buttons/SendCoinButton';
import styled, { css, FlattenSimpleInterpolation } from 'styled-components';
import { Tip } from '../../components/askDoc/Tip';
import {
  alignItemCenter,
  flex,
  flexColumn,
  flexGrow,
  flexShrink,
  justiCenter,
  justiSpaceBetween
} from '../../style/cssCommon';
import { useTranslation } from 'react-i18next';
import { Dispatch, RefObject, SetStateAction, useEffect, useMemo, useRef } from 'react';
import { RowWrapBox } from '../chat/RecommendBox/ChatRecommend';
import useResizeHeight from '../hooks/useResizeHeight';
import useLangParameterNavigate from '../hooks/useLangParameterNavigate';
import AudioInit from '../../audio/init.mpga';

const TEXT_MAX_HEIGHT = 268;

const InputBox = styled.div<{ activeInputWrap: boolean; isTesla: boolean }>`
  ${flex}
  ${alignItemCenter}
  ${flexColumn}
  ${flexShrink}
  
  height: fit-content;
  width: 100%;
  position: relative;
  background-color: white;
  box-shadow: 0 -2px 8px 0 rgba(111, 58, 208, 0.11);
  border-radius: ${(props) => (props.isTesla ? '8px' : 'none')};
  margin: ${(props) => (props.isTesla ? '5px' : '0')};

  textarea {
    border-radius: ${(props) => (props.isTesla ? '8px' : 'none')};
  }
`;

export const RowBox = styled.div<{ cssExt?: FlattenSimpleInterpolation }>`
  ${flex}
  ${justiSpaceBetween}
  ${alignItemCenter}
  width: 100%;
  gap: 6px;

  ${({ cssExt }) => cssExt && cssExt}
`;

const TextBox = styled(RowBox)`
  textarea {
    ${flex}
    ${justiCenter}
    ${flexGrow}

    width: fit-content;
    border: 0;
    max-height: ${TEXT_MAX_HEIGHT}px;
    height: 48px;
    padding: 14px 16px 14px 16px;

    &:disabled {
      background-color: #fff;
      font-size: 13px;
    }
  }
`;

const InputBottomArea = styled(RowWrapBox)`
  height: 34px;
  padding: 0px 3px 0px 9px;
  border-top: 1px solid var(--ai-purple-99-bg-light);
`;

const LengthWrapper = styled.div<{ isError?: boolean }>`
  ${flex}
  ${alignItemCenter}

  font-size: 12px;
  color: var(--gray-gray-70);

  ${({ isError }) =>
    isError !== undefined &&
    css`
      color: ${isError ? 'var(--sale)' : 'var(--gray-gray-70)'};
    `}
`;

export const ChatBottom = ({
  loadingId,
  isActiveInput,
  setIsActiveInput,
  chatInput,
  onSubmitAskdocChat,
  setChatInput
}: {
  loadingId: string | null;
  isActiveInput: boolean;
  setIsActiveInput: Dispatch<SetStateAction<boolean>>;
  chatInput: string;
  onSubmitAskdocChat: (api: 'gpt' | 'askDoc', chatText?: string) => {};
  setChatInput: Dispatch<SetStateAction<string>>;
}) => {
  const { t } = useTranslation();
  const { isTesla } = useLangParameterNavigate();
  const resizeHeight = useResizeHeight();

  const textRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isTesla) {
      new Audio(AudioInit).play();
    }
  }, []);

  useEffect(() => {
    if (isActiveInput && textRef?.current) {
      textRef?.current.focus();
      resizeHeight(textRef);
      if (isTesla) setIsActiveInput(true);
    }
  }, [isActiveInput]);

  useEffect(() => {
    resizeHeight(textRef);
  }, [chatInput]);

  const validCheckSubmit = () => {
    if (chatInput.length > 0) return true;
    return false;
  };

  const placeholder = useMemo(() => t(`ChatingTab.InputPlaceholder`), [t]);

  return (
    <div style={{ position: 'relative', display: 'flex' }}>
      <Tip />
      <InputBox activeInputWrap={isActiveInput && !loadingId} isTesla={isTesla}>
        <TextBox
          onClick={() => {
            setIsActiveInput(true);
          }}>
          <TextArea
            disable={!!loadingId}
            placeholder={!loadingId ? placeholder : ''}
            textRef={textRef}
            rows={1}
            value={!!loadingId ? '' : chatInput}
            onKeyDown={(e: React.KeyboardEvent<HTMLElement>) => {
              if (e.key === 'Enter' && e.ctrlKey) {
                if (validCheckSubmit()) {
                  setIsActiveInput(false);
                  resizeHeight(textRef);
                  onSubmitAskdocChat('askDoc');
                } else {
                  e.preventDefault();
                }
              }
            }}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
              setChatInput(e.target.value.slice(0, INPUT_MAX_LENGTH));
            }}
          />
          {!loadingId && isActiveInput && (
            <SendCoinButton
              disabled={!validCheckSubmit()}
              onClick={() => {
                if (validCheckSubmit()) {
                  setIsActiveInput(false);
                  resizeHeight(textRef);
                  onSubmitAskdocChat('askDoc');
                }
              }}
            />
          )}
        </TextBox>
        {!loadingId && isActiveInput && (
          <InputBottomArea>
            <LengthWrapper isError={chatInput.length >= INPUT_MAX_LENGTH}>
              {chatInput.length}/{INPUT_MAX_LENGTH}
            </LengthWrapper>
          </InputBottomArea>
        )}
      </InputBox>
    </div>
  );
};
