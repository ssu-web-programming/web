import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled, { FlattenSimpleInterpolation } from 'styled-components';
import { v4 as uuidv4 } from 'uuid';

import { apiWrapper } from '../api/apiWrapper';
import { TEXT_TO_IMAGE_API } from '../api/constant';
import { calcToken, parseGptVer } from '../api/usePostSplunkLog';
import useErrorHandle from '../components/hooks/useErrorHandle';
import Loading from '../components/Loading';
import ImageCreateInput, {
  ratioItemList,
  styleItemList,
  versionItemList
} from '../components/txt2img/ImageCreateInput';
import ImageCreateResult from '../components/txt2img/ImageCreateResult';
import { selectTabSlice, setCreating } from '../store/slices/tabSlice';
import { activeToast } from '../store/slices/toastSlice';
import {
  addT2I,
  selectT2IHistory,
  T2IOptionType,
  updateT2ICurItemIndex,
  updateT2ICurListId,
  VersionType
} from '../store/slices/txt2imgHistory';
import { useAppDispatch, useAppSelector } from '../store/store';
import { calLeftCredit } from '../util/common';

const Body = styled.div`
  display: flex;
  flex-direction: column;

  width: 100%;
  height: 100%;
  padding: 5px 16px 16px 16px;
  overflow-y: auto;
  overflow-x: hidden;
`;

export const SubTitleArea = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  width: 100%;
`;

export const RowContainer = styled.div<{
  cssExt?: FlattenSimpleInterpolation;
}>`
  display: flex;
  flex-wrap: wrap;

  width: 100%;
  gap: 8px;

  ${(props) => (props.cssExt ? props.cssExt : '')}
`;

const ImageCreate = ({ contents }: { contents: string }) => {
  const { creating } = useAppSelector(selectTabSlice);
  const dispatch = useAppDispatch();
  const { currentListId, currentItemIdx, history } = useAppSelector(selectT2IHistory);
  const errorHandle = useErrorHandle();

  const { t } = useTranslation();

  const [selectedOptions, setSelectedOptions] = useState<T2IOptionType>({
    input: contents,
    style: styleItemList[0].id,
    ratio: ratioItemList[0].id,
    type: versionItemList[0].id
  });

  const createAiImage = useCallback(
    async (option: T2IOptionType) => {
      try {
        const assistantId = uuidv4();
        dispatch(setCreating('CreateImage'));
        const apiBody: {
          prompt: string;
          imgSize: string;
          stylePreset?: string;
          type: VersionType;
        } = {
          prompt: option.input,
          imgSize: option.ratio,
          type: option.type
        };
        if (option.style !== 'none') apiBody['stylePreset'] = option.style;

        const { res, logger } = await apiWrapper().request(TEXT_TO_IMAGE_API, {
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(apiBody),
          method: 'POST'
        });

        const body = await res.json();

        const input_token = calcToken(option.input);
        logger({
          dp: 'ai.text_to_image',
          input_token,
          gpt_ver: parseGptVer(apiBody.type)
        });

        const { deductionCredit, leftCredit } = calLeftCredit(res.headers);
        dispatch(
          activeToast({
            type: 'info',
            msg: ` ${t(`Txt2ImgTab.ToastMsg.StartCreatingImage`)} 
             ${t(`ToastMsg.AboutCredit`, {
               deductionCredit: deductionCredit,
               leftCredit: leftCredit === '-1' ? t('Unlimited') : leftCredit
             })}`
          })
        );

        const { images, translatedPrompts } = body.data;
        if (images) {
          dispatch(
            addT2I({
              id: assistantId,
              list: images,
              input: option.input,
              style: option.style,
              ratio: option.ratio,
              translatedPrompts: translatedPrompts,
              type: option.type
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
    [dispatch, errorHandle, t]
  );

  useEffect(() => {
    if (contents) {
      setSelectedOptions({
        input: contents,
        style: styleItemList[0].id,
        ratio: ratioItemList[0].id,
        type: versionItemList[0].id
      });
    }
  }, [contents]);

  if (creating !== 'none') {
    return <Loading>{t(`Txt2ImgTab.LoadingMsg`)}</Loading>;
  }

  const isResultView = history.findIndex((history) => history.id === currentListId) > -1;

  return (
    <Body>
      {!isResultView ? (
        <ImageCreateInput
          history={history}
          createAiImage={createAiImage}
          options={selectedOptions}
          setOptions={setSelectedOptions}
        />
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
