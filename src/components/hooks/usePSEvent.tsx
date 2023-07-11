import styled from 'styled-components';
import { activeConfirm } from '../../store/slices/confirm';
import { activeLoadingSpinner, initLoadingSpinner } from '../../store/slices/loadingSpinner';
import { T2IType } from '../../store/slices/txt2imgHistory';
import { WriteType } from '../../store/slices/writeHistorySlice';
import { useAppDispatch } from '../../store/store';
import { alignItemCenter, flex, flexColumn, justiCenter } from '../../style/cssCommon';
import { openNewWindow } from '../../util/common';
import Bridge from '../../util/bridge';

export interface EventFuncType {
  history: WriteType[] | T2IType[];
  currentId: string;
  currentIndex?: number;
  isWrite: boolean;
}

const EVENT_DETAIL_ADDRESS = 'https://documents.polarishare.io/ai-contest';

export const openDetailPage = () => {
  openNewWindow(EVENT_DETAIL_ADDRESS);
};

const ColumBox = styled.div`
  ${flex}
  ${flexColumn}
  ${justiCenter}
  ${alignItemCenter}
`;

const usePSEvent = () => {
  const dispatch = useAppDispatch();

  const errorCallback = (callback: () => void) => {
    dispatch(initLoadingSpinner());
    dispatch(
      activeConfirm({
        msg: (
          <ColumBox>
            <div>작업 진행 중 오류가 발생했습니다.</div>
            <div>다시 한번 시도해주세요.</div>
          </ColumBox>
        ),
        btnFunc: () => {
          callback();
        }
      })
    );
  };

  const getContents = (
    isWrite: boolean,
    history: WriteType[] | T2IType[],
    currentId: string,
    currentIndex?: number
  ): Blob | string => {
    const currentContent = history[history.findIndex((history) => history.id === currentId)];

    if (!isWrite && 'list' in currentContent && currentIndex !== undefined) {
      const image = currentContent.list[currentIndex];

      const byteNumbers = new Array(image.data.length);
      for (let i = 0; i < image.data.length; i++) {
        byteNumbers[i] = image.data.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: image.contentType });
      return new File([blob], 'TextToImage.png');
    } else if ('result' in currentContent) {
      return currentContent.result;
    }
    return '';
  };

  const sendEvent = async ({ history, currentId, currentIndex, isWrite }: EventFuncType) => {
    dispatch(
      activeLoadingSpinner(
        <ColumBox>
          <div>이벤트 참여 준비중입니다.</div>
          <div>잠시만 기다려주세요.</div>
        </ColumBox>
      )
    );

    try {
      const resSession = await Bridge.checkSession('PSEvent');

      const formData = new FormData();
      formData.append('userId', resSession.userInfo.uid);
      formData.append('aiTool', isWrite ? 'AI Write' : 'Text to Image');
      formData.append('contents', getContents(isWrite, history, currentId, currentIndex));

      const api = process.env.REACT_APP_SHARE_TECH_API as string;
      const res = await fetch(api, {
        method: 'POST',
        body: formData
      });

      if (res.status !== 200) throw new Error();
      const response = (await res.json()).response;

      if (response.redirectUrl) {
        openNewWindow(response.redirectUrl);
      }
    } catch (e) {
      errorCallback(() => {
        sendEvent({
          history: history,
          currentId: currentId,
          currentIndex: currentIndex,
          isWrite: isWrite
        });
      });
    } finally {
      dispatch(initLoadingSpinner());
    }
  };

  return sendEvent;
};

export default usePSEvent;
