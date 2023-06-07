import { useCallback, useState } from 'react';
import styled from 'styled-components';
import { calcToken } from '../api/usePostSplunkLog';
import { flexColumn, justiSpaceBetween, flexWrap, alignItemCenter } from '../style/cssCommon';
import Loading from '../components/Loading';
import { v4 as uuidv4 } from 'uuid';
import { useAppDispatch, useAppSelector } from '../store/store';
import {
  T2IType,
  addT2I,
  selectT2IHIstory,
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
import { setCreating } from '../store/slices/tabSlice';
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

export interface AiImageResponse {
  contentType: string;
  data: string;
}

const ImageCreate = ({ contents }: { contents?: string }) => {
  const apiWrapper = useApiWrapper();
  const [descInput, setDescInput] = useState<string>(contents ? contents : '');
  const [selectedStyle, setSelectedStyle] = useState<string>('none');
  const [selectedRatio, setSelectedRatio] = useState<string>('512x512');
  const [creating, setCreatingImage] = useState(false);
  const dispatch = useAppDispatch();
  const { currentListId, currentItemIdx, history } = useAppSelector(selectT2IHIstory);
  const errorHandle = useErrorHandle();

  const { t } = useTranslation();

  const createAiImage = useCallback(
    async (remake?: T2IType) => {
      try {
        const assistantId = uuidv4();

        setCreatingImage(true);
        dispatch(setCreating('CreateImage'));

        const apiBody: any = {
          prompt: remake ? remake?.input : descInput,
          imgSize: remake ? remake?.ratio : selectedRatio
        };
        if (selectedStyle !== 'none')
          apiBody['style_preset'] = remake ? remake.style : selectedStyle;

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

        const input_token = calcToken(descInput);
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
              input: remake ? remake?.input : descInput,
              style: remake ? remake?.style : selectedStyle,
              ratio: remake ? remake?.ratio : selectedRatio
            })
          );
          dispatch(updateT2ICurListId(assistantId));
          dispatch(updateT2ICurItemIndex(0));

          setCreatingImage(false);
          dispatch(setCreating('none'));
        }
      } catch (error: any) {
        dispatch(updateT2ICurListId(null));
        dispatch(updateT2ICurItemIndex(null));
        setCreatingImage(false);
        dispatch(setCreating('none'));
        errorHandle(error);
      }
    },
    [descInput, selectedRatio, selectedStyle]
  );

  const currentHistory =
    history && history.length > 0 && history?.filter((history) => history.id === currentListId)[0];

  return (
    <Body>
      {creating ? (
        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}>
          <Loading>{t(`Txt2ImgTab.LoadingMsg`)}</Loading>
        </div>
      ) : !currentHistory ? (
        <ImageCreateInput
          history={history}
          descInput={descInput}
          setDescInput={setDescInput}
          setSelectedStyle={setSelectedStyle}
          selectedStyle={selectedStyle}
          setSelectedRatio={setSelectedRatio}
          selectedRatio={selectedRatio}
          createAiImage={createAiImage}
        />
      ) : (
        <ImageCreateResult
          history={history}
          currentHistory={currentHistory}
          currentItemIdx={currentItemIdx}
          currentListId={currentListId}
          createAiImage={createAiImage}
        />
      )}
    </Body>
  );
};

export default ImageCreate;
