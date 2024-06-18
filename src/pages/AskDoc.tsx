import styled, { FlattenSimpleInterpolation, css } from 'styled-components';
import TextArea from '../components/TextArea';
import { RowWrapBox } from '../components/chat/RecommendBox/ChatRecommend';
import {
  TableCss,
  justiCenter,
  flexColumn,
  flexGrow,
  flexShrink,
  alignItemCenter,
  justiSpaceBetween,
  flex
} from '../style/cssCommon';
import { useTranslation } from 'react-i18next';
import Header from '../components/layout/Header';
import AskDocSpeechBubble from '../components/askDoc/AskDocSpeechBubble';
import Button from '../components/buttons/Button';
import ico_askdoc_64 from '../img/askDoc/ico_askdoc_64.svg';

const TEXT_MAX_HEIGHT = 268;

const Wrapper = styled.div`
  ${flex}
  ${flexColumn}
  ${justiSpaceBetween}
  
  width: 100%;
  height: 100%;
  background-color: var(--ai-purple-99-bg-light);

  position: relative;

  ${TableCss}
`;

const ChatListWrapper = styled.div`
  ${flex}
  ${flexColumn}
  ${flexGrow}
  position: relative;

  width: 100%;
  overflow-y: auto;
  overflow-x: hidden;
  padding-bottom: ${({ isLoading }: { isLoading: boolean }) => (isLoading ? '0px' : '36px')};
  /* gap: 16px; */
  padding-top: 16px;
`;

const InputBox = styled.div<{ activeInputWrap: boolean }>`
  ${flex}
  ${alignItemCenter}
  ${flexColumn}
  ${flexShrink}
  
  height: fit-content;
  width: 100%;
  background-color: white;
  box-shadow: 0 -2px 8px 0 rgba(111, 58, 208, 0.11);
`;

export const RowBox = styled.div<{ cssExt?: FlattenSimpleInterpolation }>`
  ${flex}
  ${justiSpaceBetween}
  ${alignItemCenter}
  width: 100%;
  gap: 6px;

  ${({ cssExt }) => cssExt && cssExt}
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

const WrapperPage = styled.div`
  ${flex}
  ${flexColumn}
  
  width: 100%;
  height: 100%;
`;

const Body = styled.div`
  flex: 1;
  overflow: auto;
`;

const Blanket = styled.div`
  width: 100%;
  height: 100%;

  position: absolute;
  left: 0;
  top: 0;

  display: flex;
  justify-content: center;
  align-items: center;

  background-color: rgba(0, 0, 0, 0.5);
`;

const Alert = styled.div`
  display: flex;
  width: 320px;
  padding: 24px;
  flex-direction: column;
  align-items: center;
  gap: 24px;

  border-radius: 10px;
  background: #ffffff;
  box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.1);

  div {
    color: var(--Homepage-Gray-Gray90-01, #26282b);
    font-size: 18px;
    font-weight: 700;
    line-height: 27px;

    p:first-child {
      color: var(--Homepage-Gray-Gray90-01, #26282b);
      font-size: 18px;
      font-weight: 700;
      line-height: 27px;

      margin-bottom: 8px;
    }

    p:nth-child(2) {
      color: var(--Homepage-Gray-Gray80-02, #454c53);
      font-size: 14px;
      font-weight: 400;
      line-height: 21px;
    }
  }
`;

export interface ChatOptions {
  input: string;
}

const AskDoc = () => {
  const { t } = useTranslation();
  return (
    <WrapperPage>
      <Header title={t('AITools')} subTitle={'ASK Doc'}></Header>
      <Body>
        <Wrapper>
          <ChatListWrapper style={{ position: 'relative' }} isLoading={false}>
            <AskDocSpeechBubble
              loadingId={null}
              chat={{
                id: 'greeting',
                result: t(`AskDoc.Greeting`),
                role: 'info',
                input: t(`AskDoc.Greeting`)
              }}
            />
          </ChatListWrapper>
          <div style={{ position: 'relative', display: 'flex' }}>
            <InputBox activeInputWrap={false} style={{ position: 'relative', display: 'flex' }}>
              <TextBox>
                <TextArea disable={true} placeholder={''} rows={1} value={''} />
              </TextBox>
              <InputBottomArea>
                <LengthWrapper isError={false}>0/1000</LengthWrapper>
              </InputBottomArea>
            </InputBox>
          </div>
          <Blanket>
            <Alert>
              <div>
                <p>{t(`EOS.ASKDocEOSTitle`)}</p>
                <p>{t(`EOS.ASKDocEOSDesc`)}</p>
              </div>
              <img src={ico_askdoc_64} alt="icon"></img>
              <Button
                variant="gray"
                height={40}
                width={'full'}
                cssExt={css`
                  font-size: 14px;
                  color: var(--Homepage-Gray-Gray90-01, #26282b);
                `}>
                {t(`Confirm`)}
              </Button>
            </Alert>
          </Blanket>
        </Wrapper>
      </Body>
    </WrapperPage>
  );
};

export default AskDoc;
