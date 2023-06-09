import { useAppDispatch } from '../../store/store';
import iconPrev from '../../img/ico_arrow_prev.svg';
import iconNext from '../../img/ico_arrow_next.svg';
import {
  T2IType,
  updateT2ICurItemIndex,
  updateT2ICurListId
} from '../../store/slices/txt2imgHistory';
import { RowContainer, SubTitleArea } from '../../views/ImageCreate';
import SubTitle from '../SubTitle';
import RecreatingButton from '../RecreatingButton';
import { useTranslation } from 'react-i18next';
import styled, { css } from 'styled-components';
import { alignItemCenter, flex, justiCenter, justiSpaceAround } from '../../style/cssCommon';
import { RightBox, RowBox } from '../../views/AIChatTab';
import Icon from '../Icon';
import Button from '../Button';
import { activeToast } from '../../store/slices/toastSlice';
import LinkText from '../LinkText';

const GenButton = styled.div<{ disabled: boolean }>`
  position: relative;
  ${justiCenter}
  ${alignItemCenter}
  width: 100%;
  height: 35px;
  cursor: pointer;
  gap: 6px;

  font-size: 13px;
  font-weight: 500;
  line-height: 1.54;
  color: #fff;
  border-radius: 4px;
  background-image: linear-gradient(to left, #a86cea, var(--ai-purple-50-main) 100%);

  ${({ disabled }) =>
    disabled &&
    css`
      opacity: 0.3;
      pointer-events: none;
    `}
`;

const ImagePreview = styled.div`
  width: 100%;
  aspect-ratio: 1 / 1;
  max-height: 348px;
  margin-top: 16px;
`;

const ImageDesc = styled.div`
  font-size: 13px;
  font-weight: 400;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.54;
  letter-spacing: normal;
  color: var(--gray-gray-60-03);

  min-height: 40px;
  max-height: 40px;
  box-sizing: content-box;
  margin: 8px 0px 4px 0px;

  width: 100%;
  ${flex}
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
`;

const ImageList = styled.div`
  width: 100%;
  ${justiSpaceAround}
  ${alignItemCenter}
  height: 84px;
  box-sizing: border-box;
  /* margin-top: 12px; */
  padding: 12px 0px;
  margin: 12px 0px 12px 0px;
  gap: 0px 8px;
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
  createAiImage: Function;
}) => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();

  const curListIndex = history.findIndex((list) => list.id === currentListId);
  const curHistory = history[curListIndex];

  return (
    <>
      <SubTitleArea>
        <SubTitle subTitle={t(`Txt2ImgTab.PreviewImage`)} />
        <RecreatingButton
          onClick={() => {
            dispatch(updateT2ICurListId(null));
            dispatch(updateT2ICurItemIndex(null));
          }}
        />
      </SubTitleArea>
      <ImageDesc>{curHistory.input}</ImageDesc>
      <RowBox
        cssExt={css`
          ${justiCenter}
          font-size: 13px;
          color: var(--gray-gray-70);
        `}>
        <Icon
          cssExt={css`
            width: 16px;
            height: 16px;
            padding: 6px 3px 6px 5px;
            margin-right: 12px;
            opacity: ${curListIndex === 0 && '0.3'};
          `}
          iconSrc={iconPrev}
          onClick={() => {
            if (history.length <= 1) return;

            if (curListIndex > 0) dispatch(updateT2ICurListId(history[curListIndex - 1].id));
          }}
        />
        <div>
          {curListIndex + 1}/{history.length}
        </div>
        <Icon
          cssExt={css`
            width: 16px;
            height: 16px;
            padding: 6px 3px 6px 5px;
            margin-left: 12px;
            opacity: ${curListIndex === history.length - 1 && '0.3'};
          `}
          iconSrc={iconNext}
          onClick={() => {
            if (history.length <= 1) return;

            if (curListIndex < history.length - 1)
              dispatch(updateT2ICurListId(history[curListIndex + 1].id));
          }}
        />
      </RowBox>
      <ImagePreview>
        {currentItemIdx !== null && (
          <img
            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
            src={`data:${curHistory.list[currentItemIdx].contentType};base64,${curHistory.list[currentItemIdx].data}`}
            alt=""></img>
        )}
      </ImagePreview>
      <ImageList>
        <Icon
          iconSrc={iconPrev}
          cssExt={css`
            opacity: ${currentItemIdx === 0 && '0.3'};
          `}
          onClick={() => {
            if (currentItemIdx && currentItemIdx >= 1) {
              dispatch(updateT2ICurItemIndex(currentItemIdx - 1));
            }
          }}
        />
        {curHistory.list.map((img, index) => (
          <img
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
        <Icon
          iconSrc={iconNext}
          cssExt={css`
            opacity: ${currentItemIdx === 3 && '0.3'};
          `}
          onClick={() => {
            if (currentItemIdx !== null && currentItemIdx <= 2) {
              dispatch(updateT2ICurItemIndex(currentItemIdx + 1));
            }
          }}
        />
      </ImageList>
      <RowContainer>
        <Button
          isCredit={true}
          onClick={() =>
            createAiImage({
              input: curHistory.input,
              style: curHistory.style,
              ratio: curHistory.ratio
            })
          }>
          {t(`WriteTab.Recreating`)}
        </Button>
        <Button
          onClick={async () => {
            try {
              if (currentItemIdx === null) throw new Error('invalid currentItemIdx');
              const selected = curHistory.list[currentItemIdx];

              if (!selected) throw new Error('invalid target');

              const res = await fetch(
                `data:${curHistory.list[currentItemIdx].contentType};base64,${curHistory.list[currentItemIdx].data}`
              );
              const blob = await res.blob();
              window._Bridge.downloadImage(blob);
            } catch (err) {
              // TODO : error handle
            }
          }}>
          {t(`Download`)}
        </Button>
        <GenButton
          onClick={async () => {
            try {
              if (currentItemIdx === null) throw new Error('invalid currentItemIdx');
              const selected = curHistory.list[currentItemIdx];

              if (!selected) throw new Error('invalid target');

              const res = await fetch(
                `data:${curHistory.list[currentItemIdx].contentType};base64,${curHistory.list[currentItemIdx].data}`
              );
              const blob = await res.blob();
              window._Bridge.insertImage(blob);

              dispatch(
                activeToast({
                  active: true,
                  msg: t(`Txt2ImgTab.ToastMsg.CompleteInsertImage`),
                  isError: false
                })
              );
            } catch (err) {
              // TODO : error handle
            }
          }}
          disabled={false}>
          {t(`WriteTab.InsertDoc`)}
        </GenButton>
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
