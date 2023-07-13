import { useAppDispatch } from '../../store/store';
import iconPrev from '../../img/ico_arrow_prev.svg';
import iconNext from '../../img/ico_arrow_next.svg';
import {
  T2IOptionType,
  T2IType,
  updateT2ICurItemIndex,
  updateT2ICurListId
} from '../../store/slices/txt2imgHistory';
import { RowContainer, SubTitleArea } from '../../views/ImageCreate';
import SubTitle from '../SubTitle';
import ReturnButton from '../buttons/ReturnButton';
import { useTranslation } from 'react-i18next';
import styled, { css } from 'styled-components';
import {
  alignItemCenter,
  flex,
  flexColumn,
  flexGrow,
  flexShrink,
  justiCenter,
  justiSpaceAround,
  justiSpaceBetween
} from '../../style/cssCommon';
import { RightBox } from '../../views/AIChatTab';
import Button from '../buttons/Button';
import { activeToast } from '../../store/slices/toastSlice';
import LinkText from '../LinkText';
import CreditButton from '../buttons/CreditButton';
import Grid from '../layout/Grid';
import Bridge from '../../util/bridge';
import icon_arrow_down from '../../img/ico_arrow_down_small.svg';
import icon_arrow_up from '../../img/ico_arrow_up_small.svg';
import { useMemo, useState } from 'react';
import IconButton from '../buttons/IconButton';

const ImagePreview = styled.div`
  width: 100%;
  aspect-ratio: 1 / 1;
  max-height: 348px;
  margin-top: 16px;
`;

const InputDescKor = styled.p`
  ${flex}
  width: 100%;
  max-height: 40px;

  font-size: 13px;
  font-weight: 400;
  line-height: 1.54;
  color: var(--gray-gray-60-03);
  box-sizing: content-box;

  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
`;

const InputDescEng = styled(InputDescKor)`
  height: 20px;
  -webkit-line-clamp: 1;
`;

const ImageList = styled.div`
  ${flex}
  ${justiSpaceAround}
  ${alignItemCenter}
  
  width: 100%;
  height: 84px;
  box-sizing: border-box;
  padding: 12px 0px;
  margin: 12px 0px 12px 0px;
  gap: 0px 8px;
`;

const InputDescBox = styled.div`
  ${flex}
  ${justiSpaceBetween}
  margin-top: 5px;
`;

const InputDesc = styled.div`
  ${flex}
  ${flexColumn}
  ${flexGrow}
  ${flexShrink}
  position: relative;
  width: 100%;
  gap: 5px;
`;

const FloatOpenDesc = styled.div`
  position: absolute;
  ${flex}
  ${flexColumn}
  ${flexGrow}
  width: 100%;
  height: 168px;
  border-radius: 4px;
  border: solid 1px var(--gray-gray-50);
  background-color: #fff;
  padding: 8px 12px;
  box-sizing: border-box;
  overflow-y: auto;
  top: 0px;

  font-size: 13px;
  color: var(--gray-gray-60-03);
  gap: 5px;
  z-index: 1;
`;

const ImgListControl = styled.div`
  ${flex}
  ${justiSpaceBetween}
  ${alignItemCenter}
  ${justiCenter}

  width: 100%;
  font-size: 13px;
  color: var(--gray-gray-70);
  gap: 4px;
  margin-top: 8px;
`;

const ImageCreateResult = ({
  history,
  currentItemIdx,
  createAiImage,
  currentListId
}: {
  history: T2IType[];
  currentListId: string | null;
  currentItemIdx: number | null;
  createAiImage: (option: T2IOptionType) => void;
}) => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const [showInput, setShowInput] = useState<boolean>(false);

  const curListIndex = useMemo(
    () => history.findIndex((list) => list.id === currentListId),
    [history, currentListId]
  );
  const curHistory = useMemo(() => history[curListIndex], [history, curListIndex]);

  return (
    <>
      <SubTitleArea>
        <SubTitle subTitle={t(`Txt2ImgTab.PreviewImage`)} />
        <ReturnButton
          onClick={() => {
            dispatch(updateT2ICurListId(null));
            dispatch(updateT2ICurItemIndex(null));
          }}
        />
      </SubTitleArea>
      <InputDescBox>
        <InputDesc>
          <InputDescKor>{curHistory.input}</InputDescKor>
          <InputDescEng>{curHistory.translatedPrompts}</InputDescEng>
          {showInput && (
            <FloatOpenDesc>
              <p>{curHistory.input}</p>
              <p>{curHistory.translatedPrompts}</p>
            </FloatOpenDesc>
          )}
        </InputDesc>
        <IconButton
          iconSize="sm"
          iconSrc={showInput ? icon_arrow_up : icon_arrow_down}
          buttonWidth={24}
          buttonHeight={24}
          variant="white"
          buttonCssExt={css`
            border-radius: 12px;
            border: solid 0.9px #c9cdd2;
            align-self: center;
            margin-left: 9px;
            box-shadow: 0 2px 4px 0 rgba(111, 58, 208, 0.2);
          `}
          onClick={() => {
            setShowInput((prev) => !prev);
          }}
        />
      </InputDescBox>
      <ImgListControl>
        <IconButton
          buttonWidth={30}
          buttonHeight={26}
          disable={curListIndex === 0}
          onClick={() => {
            if (history.length <= 1) return;
            if (curListIndex > 0) dispatch(updateT2ICurListId(history[curListIndex - 1].id));
          }}
          iconSize="sm"
          iconSrc={iconPrev}
        />
        <div>
          {curListIndex + 1}/{history.length}
        </div>
        <IconButton
          buttonWidth={30}
          buttonHeight={26}
          disable={curListIndex === history.length - 1}
          onClick={() => {
            if (history.length <= 1) return;

            if (curListIndex < history.length - 1)
              dispatch(updateT2ICurListId(history[curListIndex + 1].id));
          }}
          iconSize="sm"
          iconSrc={iconNext}
        />
      </ImgListControl>
      <ImagePreview>
        {currentItemIdx !== null && (
          <img
            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
            src={`data:${curHistory.list[currentItemIdx].contentType};base64,${curHistory.list[currentItemIdx].data}`}
            alt=""></img>
        )}
      </ImagePreview>
      <ImageList>
        <IconButton
          buttonWidth={26}
          buttonHeight={26}
          variant="transparent"
          disable={currentItemIdx === 0}
          onClick={() => {
            if (currentItemIdx && currentItemIdx >= 1) {
              dispatch(updateT2ICurItemIndex(currentItemIdx - 1));
            }
          }}
          iconSrc={iconPrev}
          iconSize="sm"
        />
        {curHistory.list.map((img, index) => (
          <img
            key={index}
            onClick={() => {
              dispatch(updateT2ICurItemIndex(index));
            }}
            style={{
              width: '60px',
              height: '60px',
              borderRadius: '4px',
              cursor: 'pointer',
              opacity: `${index === currentItemIdx ? '1' : '0.6'}`
            }}
            src={`data:${img.contentType};base64,${img.data}`}
            alt=""></img>
        ))}
        <IconButton
          buttonWidth={26}
          buttonHeight={26}
          variant="transparent"
          disable={currentItemIdx === 3}
          onClick={() => {
            if (currentItemIdx !== null && currentItemIdx <= 2) {
              dispatch(updateT2ICurItemIndex(currentItemIdx + 1));
            }
          }}
          iconSrc={iconNext}
          iconSize="sm"
        />
      </ImageList>
      <RowContainer>
        <Grid col={2}>
          <CreditButton
            width="full"
            borderType="gray"
            height={32}
            onClick={() =>
              createAiImage({
                input: curHistory.input,
                style: curHistory.style,
                ratio: curHistory.ratio
              })
            }>
            {t(`WriteTab.Recreating`)}
          </CreditButton>
          <Button
            width="full"
            borderType="gray"
            height={32}
            onClick={async () => {
              try {
                if (currentItemIdx === null) throw new Error('invalid currentItemIdx');
                const selected = curHistory.list[currentItemIdx];

                if (!selected) throw new Error('invalid target');

                const res = await fetch(
                  `data:${curHistory.list[currentItemIdx].contentType};base64,${curHistory.list[currentItemIdx].data}`
                );
                const blob = await res.blob();
                Bridge.callBridgeApi('downloadImage', blob);
              } catch (err) {
                // TODO : error handle
              }
            }}>
            {t(`Download`)}
          </Button>
        </Grid>
        <Button
          width={'full'}
          height={28}
          variant={'purpleGradient'}
          onClick={async () => {
            try {
              if (currentItemIdx === null) throw new Error('invalid currentItemIdx');
              const selected = curHistory.list[currentItemIdx];

              if (!selected) throw new Error('invalid target');

              const res = await fetch(
                `data:${curHistory.list[currentItemIdx].contentType};base64,${curHistory.list[currentItemIdx].data}`
              );
              const blob = await res.blob();
              Bridge.callBridgeApi('insertImage', blob);

              dispatch(
                activeToast({ type: 'info', msg: t(`Txt2ImgTab.ToastMsg.CompleteInsertImage`) })
              );
            } catch (err) {
              // TODO : error handle
            }
          }}>
          {t(`WriteTab.InsertDoc`)}
        </Button>
      </RowContainer>
      <RightBox
        cssExt={css`
          margin-top: 11px;
        `}>
        <LinkText url={t(`MoveToLimitInfo`)}>
          <div style={{ color: '#8769ba', fontSize: '11px' }}>
            Powered By <b>Stable Diffusion</b>
          </div>
        </LinkText>
      </RightBox>
    </>
  );
};

export default ImageCreateResult;
