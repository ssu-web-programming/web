import { useMemo, useState } from 'react';
import IconTextButton from 'components/buttons/IconTextButton';
import DownloadIcon from 'img/ico_download_white.svg';
import InsertDocsIcon from 'img/ico_insert_docs.svg';
import { useTranslation } from 'react-i18next';
import styled, { css } from 'styled-components';

import { ReactComponent as IconArrowDown } from '../../img/ico_arrow_down_small.svg';
import { ReactComponent as IconArrowUp } from '../../img/ico_arrow_up_small.svg';
import icon_credit_purple from '../../img/ico_credit_purple.svg';
import { activeToast } from '../../store/slices/toastSlice';
import {
  T2IOptionType,
  T2IType,
  updateT2ICurItemIndex,
  updateT2ICurListId
} from '../../store/slices/txt2imgHistory';
import { useAppDispatch } from '../../store/store';
import Bridge from '../../util/bridge';
import { RowContainer, SubTitleArea } from '../../views/ImageCreate';
import ArrowSwitcher from '../ArrowSwitcher';
import Button from '../buttons/Button';
import IconButton from '../buttons/IconButton';
import ReturnButton from '../buttons/ReturnButton';
import Grid from '../layout/Grid';
import LinkText from '../LinkText';
import SubTitle from '../SubTitle';

import { versionItemList } from './ImageCreateInput';

const ImagePreview = styled.div`
  width: 100%;
  aspect-ratio: 1;
  max-height: 348px;
  margin: 16px 0 12px;
`;

const InputDescKor = styled.p`
  display: flex;
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

const InputDescBox = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 5px;
`;

const InputDesc = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  flex-shrink: 1;
  position: relative;
  width: 100%;
  gap: 5px;
`;

const FloatOpenDesc = styled.div`
  position: absolute;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  width: 100%;
  height: 168px;
  border-radius: 4px;
  border: solid 1px var(--gray-gray-50);
  background-color: #fff;
  padding: 8px 12px;
  overflow-y: auto;
  top: 0px;

  font-size: 13px;
  color: var(--gray-gray-60-03);
  gap: 5px;
  z-index: 1;
`;

const ImgListSwitcher = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  justify-content: center;

  width: 100%;
  font-size: 13px;
  color: var(--gray-gray-70);
  gap: 4px;
  margin-top: 8px;
`;

const LicenseMark = styled.div`
  display: flex;
  align-items: center;

  align-self: flex-end;
  margin-top: 11px;
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
  const handleDownloadFile = async () => {
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
      console.log('err', err);
    }
  };

  const handleInsertDocument = async () => {
    try {
      if (currentItemIdx === null) throw new Error('invalid currentItemIdx');
      const selected = curHistory.list[currentItemIdx];

      if (!selected) throw new Error('invalid target');

      const res = await fetch(
        `data:${curHistory.list[currentItemIdx].contentType};base64,${curHistory.list[currentItemIdx].data}`
      );
      const blob = await res.blob();
      Bridge.callBridgeApi('insertImage', blob);

      dispatch(activeToast({ type: 'info', msg: t(`Txt2ImgTab.ToastMsg.CompleteInsertImage`) }));
    } catch (err) {
      // TODO : error handle
      console.log('err', err);
    }
  };

  if (curListIndex === null || currentItemIdx === null) return <></>;

  return (
    <>
      <SubTitleArea>
        <SubTitle subTitle={t(`Txt2ImgTab.PreviewImage`)} />
        <ReturnButton
          onClick={() => {
            dispatch(updateT2ICurListId(null));
            dispatch(updateT2ICurItemIndex(null));
          }}>
          {t(`WriteTab.ReEnterTopic`)}
        </ReturnButton>
      </SubTitleArea>
      {/* 호진FIXME: styled-component display : flex가 웹오피스내에서는 먹히지가 않음,, */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginTop: '5px'
        }}>
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
          iconComponent={showInput ? IconArrowUp : IconArrowDown}
          width={24}
          height={24}
          variant="white"
          cssExt={css`
            border-radius: 12px;
            border: solid 0.9px #c9cdd2;
            align-self: center;
            margin-left: 9px;
            box-shadow: 0 2px 4px 0 rgba(111, 58, 208, 0.2);
          `}
          onClick={() => setShowInput((prev) => !prev)}
        />
      </div>
      <ImgListSwitcher>
        <ArrowSwitcher
          size="sm"
          type="index"
          listLength={history.length}
          curListIndex={curListIndex}
          onPrev={() => {
            if (history.length <= 1) return;
            if (curListIndex > 0) {
              dispatch(updateT2ICurListId(history[curListIndex - 1].id));
              dispatch(updateT2ICurItemIndex(0));
            }
          }}
          onNext={() => {
            if (history.length <= 1) return;
            if (curListIndex < history.length - 1) {
              dispatch(updateT2ICurListId(history[curListIndex + 1].id));
              dispatch(updateT2ICurItemIndex(0));
            }
          }}
        />
      </ImgListSwitcher>
      <ImagePreview>
        {currentItemIdx !== null && (
          <img
            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
            src={`data:${curHistory.list[currentItemIdx].contentType};base64,${curHistory.list[currentItemIdx].data}`}
            alt=""></img>
        )}
      </ImagePreview>
      {/* <ImageList>
        <ArrowSwitcher
          size="sm"
          type="imgList"
          listLength={currentItemIdx !== null ? history[curListIndex]?.list?.length : 0}
          curListIndex={currentItemIdx}
          onPrev={() => {
            if (currentItemIdx !== null && currentItemIdx >= 1)
              dispatch(updateT2ICurItemIndex(currentItemIdx - 1));
          }}
          onNext={() => {
            if (currentItemIdx !== null && currentItemIdx <= 2)
              dispatch(updateT2ICurItemIndex(currentItemIdx + 1));
          }}>
          {curHistory.list.map((img, index) => (
            <img
              onClick={() => {
                dispatch(updateT2ICurItemIndex(index));
              }}
              style={{
                display: 'flex',
                width: '100%',
                height: '100%',
                borderRadius: '4px',
                opacity: `${index === currentItemIdx ? '1' : '0.6'}`
              }}
              src={`data:${img.contentType};base64,${img.data}`}
              alt=""></img>
          ))}
        </ArrowSwitcher>
      </ImageList> */}
      <RowContainer>
        <IconTextButton
          width="full"
          borderType="gray"
          height={48}
          onClick={() =>
            createAiImage({
              input: curHistory.input,
              style: curHistory.style,
              ratio: curHistory.ratio,
              type: curHistory.type
            })
          }
          iconSrc={icon_credit_purple}
          iconPos="end"
          iconSize={18}
          cssExt={css`
            border-radius: 8px;
            font-size: 15px;
          `}>
          {t(`WriteTab.Recreating`)}
        </IconTextButton>

        <Grid col={2}>
          {/* 호진FIXME: 다국어 적용해야함! */}
          <IconTextButton
            width={'full'}
            height={48}
            borderType="gray"
            onClick={handleInsertDocument}
            iconSrc={InsertDocsIcon}
            iconPos={'left'}
            iconSize={24}
            cssExt={css`
              border-radius: 8px;
              font-size: 15px;
            `}>
            {t(`WriteTab.InsertDoc`)}
          </IconTextButton>

          {/* 호진FIXME: 다국어 적용해야함! */}
          <IconTextButton
            width={'full'}
            height={48}
            borderType="gray"
            onClick={handleDownloadFile}
            iconSrc={DownloadIcon}
            iconPos={'left'}
            iconSize={24}
            variant="purple"
            cssExt={css`
              border-radius: 8px;
              font-size: 15px;
            `}>
            {t(`Download`)}
          </IconTextButton>
        </Grid>
      </RowContainer>
      <LicenseMark>
        <LinkText url={t(`MoveToLimitInfo`)}>
          <div style={{ color: '#72787F', fontSize: '11px' }}>
            Powered By <b>{versionItemList.find((item) => item.id === curHistory.type)?.title}</b>
          </div>
        </LinkText>
      </LicenseMark>
    </>
  );
};

export default ImageCreateResult;
