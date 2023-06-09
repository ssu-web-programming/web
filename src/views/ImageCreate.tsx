import { useCallback } from 'react';
import styled from 'styled-components';
import { calcToken } from '../api/usePostSplunkLog';
import { flexColumn, justiSpaceBetween, flexWrap, alignItemCenter } from '../style/cssCommon';
import Loading from '../components/Loading';
import { v4 as uuidv4 } from 'uuid';
import { useAppDispatch, useAppSelector } from '../store/store';
import {
  T2IOptionType,
  addT2I,
  selectT2IHistory,
  updateT2ICurItemIndex,
  updateT2ICurListId
} from '../store/slices/txt2imgHistory';
import { JSON_CONTENT_TYPE, TEXT_TO_IMAGE_API } from '../api/constant';
import { activeToast } from '../store/slices/toastSlice';
import useApiWrapper from '../api/useApiWrapper';
import { useTranslation } from 'react-i18next';
import { calLeftCredit } from '../util/common';
import useErrorHandle from '../components/hooks/useErrorHandle';
import { INVALID_PROMPT } from '../error/error';
import { selectTabSlice, setCreating } from '../store/slices/tabSlice';
import ImageCreateInput from '../components/txt2img/ImageCreateInput';
import ImageCreateResult from '../components/txt2img/ImageCreateResult';

const Body = styled.div`
  width: 100%;
  height: 100%;
  ${flexColumn}
  /* gap: 17px; */
  padding: 16px;
  box-sizing: border-box;

  overflow-y: auto;
  overflow-x: hidden;
`;

export const SubTitleArea = styled.div`
  width: 100%;
  ${justiSpaceBetween}
  ${alignItemCenter}
`;

export const RowContainer = styled.div<{
  cssExt?: any;
}>`
  width: '100%';
  ${flexWrap}

  gap: 8px;

  ${({ cssExt }) => cssExt && cssExt}
`;

const ImageCreate = ({ contents }: { contents?: string }) => {
  const apiWrapper = useApiWrapper();
  const { creating } = useAppSelector(selectTabSlice);
  const dispatch = useAppDispatch();
  const { currentListId, currentItemIdx, history } = useAppSelector(selectT2IHistory);
  const errorHandle = useErrorHandle();

  const { t } = useTranslation();

  const createAiImage = useCallback(
    async (option: T2IOptionType) => {
      try {
        const assistantId = uuidv4();
        dispatch(setCreating('CreateImage'));
        const apiBody: any = {
          prompt: option.input,
          imgSize: option.ratio
        };
        if (option.style !== 'none') apiBody['style_preset'] = option.style;

        const { res, logger } = await apiWrapper(TEXT_TO_IMAGE_API, {
          headers: {
            ...JSON_CONTENT_TYPE,
            'User-Agent': navigator.userAgent
          },
          body: JSON.stringify(apiBody),
          method: 'POST'
        });

        const body = await res.json();

        if (res.status !== 200) {
          if (body?.error?.code === 'invalid_prompt') throw new Error(INVALID_PROMPT);
          else throw res;
        }

        const input_token = calcToken(option.input);
        logger({
          dp: 'ai.text_to_image',
          input_token
        });

        const { deductionCredit, leftCredit } = calLeftCredit(res.headers);
        dispatch(
          activeToast({
            active: true,
            msg: ` ${t(`Txt2ImgTab.ToastMsg.StartCreatingImage`)} 
             ${t(`ToastMsg.AboutCredit`, {
               deductionCredit: deductionCredit,
               leftCredit: leftCredit
             })}`,
            isError: false
          })
        );

        const { images } = body.data;
        if (images) {
          dispatch(
            addT2I({
              id: assistantId,
              list: images,
              input: option.input,
              style: option.style,
              ratio: option.ratio
            })
          );
          dispatch(updateT2ICurListId(assistantId));
          dispatch(updateT2ICurItemIndex(0));
        }
      } catch (error: any) {
        dispatch(updateT2ICurListId(null));
        dispatch(updateT2ICurItemIndex(null));
        errorHandle(error);
      } finally {
        dispatch(setCreating('none'));
      }
    },
    [apiWrapper, dispatch, errorHandle, t]
  );

  if (creating !== 'none') {
    return <Loading>{t(`Txt2ImgTab.LoadingMsg`)}</Loading>;
  }

  const isResultView = history.findIndex((history) => history.id === currentListId) > -1;

  return (
    <Body>
      {!isResultView ? (
        <ImageCreateInput history={history} createAiImage={createAiImage} />
      ) : (
        <ImageCreateResult
          history={history}
          currentListId={currentListId}
          currentItemIdx={currentItemIdx}
          createAiImage={createAiImage}
        />
      )}
    </Body>
  );
};

export default ImageCreate;
