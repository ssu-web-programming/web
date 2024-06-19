import styled, { css } from 'styled-components';
import Header from '../../components/layout/Header';
import { useTranslation } from 'react-i18next';
import { Suspense, useCallback, useEffect, useRef, useState } from 'react';
import uiBuild from './builder';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Divider } from '@mui/material';

import AppIconRefresh from '../../img/alli/alli-icon-refresh.svg';
import { ReactComponent as IconDocument } from '../../img/askDoc/ico_document_64.svg';

import Button from '../../components/buttons/Button';
import { useAppDispatch, useAppSelector } from '../../store/store';
import { initFlagSelector } from '../../store/slices/initFlagSlice';
import CreditButton from '../../components/buttons/CreditButton';
import Loading from '../../components/Loading';
import { ALLI_RESPONSE_STREAM_API } from '../../api/constant';
import { calLeftCredit, insertDoc } from '../../util/common';
import { useShowCreditToast } from '../../components/hooks/useShowCreditToast';
import useErrorHandle from '../../components/hooks/useErrorHandle';
import { activeToast } from '../../store/slices/toastSlice';
import { lang } from '../../locale';
import {
  resetCreateResult,
  selectAlliApps,
  setCreateResult,
  setSelectedApp
} from '../../store/slices/alliApps';
import AlliApps from './AlliApps';
import ga, { init } from '../../util/gaConnect';
import PreMarkdown from '../../components/PreMarkdown';
import { apiWrapper, streaming } from '../../api/apiWrapper';
import Bridge from '../../util/bridge';
import { useConfirm } from '../../components/Confirm';
import { setCreating } from '../../store/slices/tabSlice';

const Wrapper = styled.div`
  width: 100%;
  height: 100%;

  display: flex;
  flex-direction: column;
`;

const Body = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  padding: 5px 16px;

  gap: 10px;
  overflow-y: auto;

  padding: 40px 0px;
  position: relative;
`;

const AppContents = styled.div`
  width: 100%;

  display: flex;
  flex-direction: column;
  flex: 1;

  padding: 0px 24px;

  overflow-y: auto;
`;

const MakingOverlap = styled.div`
  left: 0;
  top: 0;
  position: absolute;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const AppName = styled.div`
  font-size: 21px;
  font-weight: 700;
  line-height: 32px;
  letter-spacing: 0px;
  text-align: left;
`;

const AppDesc = styled.div`
  font-size: 14px;
  font-weight: 400;
  line-height: 21px;
  letter-spacing: 0px;
  text-align: left;

  margin-bottom: 32px;
`;

const ResultArea = styled.div`
  display: flex;
  flex-direction: column;

  gap: 8px;
`;

const ResultTitle = styled.div`
  font-weight: 700;
  font-size: 13px;
  line-height: 20px;
  color: #6f3ad0;
`;

const RunResult = styled.div`
  width: 100%;
  border: 1px solid #6f3ad0;
  padding: 8px 12px;
  border-radius: 4px;
`;

const PoweredBy = styled.div`
  margin-top: 8px;
  margin-bottom: 24px;
  font-size: 11px;
  font-weight: 500;
  line-height: 13px;
  letter-spacing: 0px;
  text-align: right;
  color: #8769ba;
`;

const Footer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 32px;
  margin-top: auto;
`;

const RefreshArea = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
`;

const RefreshButton = styled.div<{ disabled: boolean }>`
  width: 40px;
  height: 40px;
  background: linear-gradient(180deg, #a86cea 0%, #6f3ad0 100%);
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  &:hover {
    cursor: pointer;
  }

  ${({ disabled }) =>
    disabled &&
    css`
      opacity: 0.3;
      pointer-events: none;
    `}
`;

const Buttons = styled.div`
  display: flex;
  flex-direction: row;
  gap: 10px;
`;

const ConfirmContents = styled.div`
  font-size: 14px;
  font-weight: 400;
  line-height: 21px;
  text-align: left;
`;

const ConfirmTitle = styled.div`
  font-size: 18px;
  font-weight: 700;
  line-height: 27px;
  text-align: left;
  color: #000000;

  margin-bottom: 8px;
`;

export interface ResponseAppInputOption {
  name: string;
  value: string;
}

export interface ResponseAppInputInfo {
  name: string;
  inputType: string;
  value: string;
  placeholder?: string;
  options: ResponseAppInputOption[];
}

export interface AppInfo {
  id: string;
  name: string;
  type: string;
  description: string;
  category: string;
  appFrom: string;
  appUrl: string;
  inputs: ResponseAppInputInfo[];
  icon?: string;
}

const theme = createTheme({
  typography: {
    fontFamily: `'Noto Sans KR', 'Apple SD Gothic Neo', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif`
  },
  components: {
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiInputBase-root': {
            fontSize: '13px',
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              border: '1px solid #6F3AD0'
            }
          }
        }
      }
    },
    MuiSelect: {
      styleOverrides: {
        root: {
          fontSize: '13px',
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            border: '1px solid #6F3AD0'
          }
        }
      }
    }
  }
});

type StreamingStatus = 'none' | 'request' | 'streaming';

export default function Alli() {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();

  const errorHandle = useErrorHandle();
  const showCreditToast = useShowCreditToast();
  const confirm = useConfirm();

  const { isInit } = useAppSelector(initFlagSelector);
  const { selectedApp, createResult } = useAppSelector(selectAlliApps);

  const [inputs, setInputs] = useState<any>(createResult.inputs);
  const [result, setResult] = useState<string>(createResult.output);
  const [refSlideNum, setRefSlideNum] = useState<number>(createResult.refSlideNum);
  const [insertSlideNum, setInsertSlideNum] = useState<number>(createResult.insertSlideNum);

  const [streamingStatus, setStreamingStatus] = useState<StreamingStatus>('none');

  const requestor = useRef<any>();

  const selectApp = (appInfo: AppInfo) => {
    dispatch(setSelectedApp(appInfo));
    ga.event({ category: 'AI Apps', action: 'App Select', label: appInfo.id });
  };

  const refresh = (appInfo?: AppInfo) => {
    dispatch(resetCreateResult());
    setInputs({});
    setRefSlideNum(0);
    setInsertSlideNum(0);
    setResult('');
    if (appInfo) {
      selectApp(appInfo);
    }
    ga.event({
      category: 'AI Apps',
      action: appInfo ? 'App Refresh' : 'Back to App List',
      label: selectedApp?.id
    });
  };

  const goBack = () => {
    refresh();
    dispatch(setSelectedApp(null));
  };

  const requestAlliRun = async (appId: string, inputs: any) => {
    let resultText = '';
    try {
      dispatch(setCreating('AI Apps'));
      setStreamingStatus('request');
      requestor.current = apiWrapper();
      const { res } = await requestor.current?.request(ALLI_RESPONSE_STREAM_API, {
        body: { inputs, appId, lang },
        method: 'POST'
      });

      const { deductionCredit, leftCredit } = calLeftCredit(res.headers);
      showCreditToast(deductionCredit, leftCredit);

      setStreamingStatus('streaming');
      await streaming(res, (contents) => {
        setResult((prev) => prev + contents);
        resultText += contents;
      });
    } catch (err) {
      if (requestor.current?.isAborted() === true) {
      } else {
        errorHandle(err);
      }
    } finally {
      dispatch(setCreating('none'));
      dispatch(
        setCreateResult({ inputs, output: resultText, refSlideNum, insertSlideNum: refSlideNum })
      );
      setStreamingStatus('none');
      ga.event({ category: 'AI Apps', action: 'App Run', label: appId });
    }
  };

  const onClickStop = () => {
    requestor.current?.abort();
    dispatch(activeToast({ type: 'info', msg: t(`ToastMsg.StopMsg`) }));
  };

  const hasEmpty = (inputs: any) =>
    Object.values(inputs).some((val) => val === undefined || val === '');

  const parseShape = useCallback((contents: any) => {
    const getShapeText = (shape: any) => Object.values(shape.text).join('\n');
    const texts = contents.map((c: any) => {
      try {
        if (c.type === 'shape') {
          return getShapeText(c.shape);
        } else if (c.type === 'group') {
          return parseShape(c.shapes).join('\n');
        } else if (c.type === 'table') {
          return c.table.cells.map((c: any) => getShapeText(c)).join('\n');
        } else {
          console.log('unknown type', c.type);
          return '';
        }
      } catch (err) {
        return '';
      }
    });
    return texts;
  }, []);

  const onClickGetSlideContents = useCallback(
    async (prop: ResponseAppInputInfo) => {
      if (inputs[prop.value]) {
        const ret = await confirm({
          msg: (
            <>
              <ConfirmContents>
                <ConfirmTitle>{t('Alli.ReCheck')}</ConfirmTitle>
                {t('Alli.AlreadyExistSlideContents')}
              </ConfirmContents>
              <div style={{ marginTop: '24px' }}>
                <IconDocument></IconDocument>
              </div>
            </>
          ),
          onOk: { text: t('Confirm'), callback: () => {} },
          onCancel: { text: t('Cancel'), callback: () => {} }
        });
        if (!ret) return;
      }

      try {
        Bridge.callSyncBridgeApiWithCallback({
          api: 'getSlideContents',
          callback: (response) => {
            try {
              const { contents, slide_number, note } = JSON.parse(response); // slide contents type is string

              if (note) {
                dispatch(
                  activeToast({
                    type: 'error',
                    msg: t('Alli.AlreadyExistNote')
                  })
                );
              }
              const texts = parseShape(contents);
              setInputs((prev: any) => ({ ...prev, [prop.value]: texts.join('\n') }));
              setResult('');
              setRefSlideNum(slide_number);
            } catch (err) {}
          }
        });
      } catch (err) {}
    },
    [inputs, confirm, dispatch, parseShape, t]
  );

  const inputComponents = selectedApp
    ? uiBuild(
        {
          appId: selectedApp.id,
          props: selectedApp.inputs,
          GetSlideContentsButton: (
            <Button
              variant="white"
              width={'full'}
              height={40}
              cssExt={css`
                margin-top: 8px;
              `}
              selected={true}
              onClick={() =>
                onClickGetSlideContents(
                  selectedApp.inputs.find((input) => input.inputType === 'paragraph')!
                )
              }>
              {t('Alli.getCurrentSlideNote')}
            </Button>
          ),
          slideNum: refSlideNum > 0 ? `${t('Alli.RefPage', { page: refSlideNum })}` : undefined
        },
        setInputs,
        inputs
      )
    : undefined;

  useEffect(() => {
    init();
    ga.event({ category: 'AI Apps', action: 'App List' });
  }, []);

  useEffect(() => {
    if (selectedApp?.inputs && createResult.output === '') {
      const initVal = selectedApp.inputs.reduce((acc, cur) => {
        return {
          ...acc,
          [cur.value]:
            cur.value === 'language'
              ? cur.options.find((opt) => opt.value.toLowerCase().startsWith(lang))?.value
              : isSlideNoteApp(selectedApp.id)
              ? cur.options[0]?.value
              : undefined
        };
      }, {});
      setInputs(initVal);
    }
  }, [selectedApp, createResult.output]);

  return (
    <ThemeProvider theme={theme}>
      <Wrapper>
        <Header title={t('AITools')} subTitle={'AI Apps'}></Header>
        <Body>
          {!selectedApp ? (
            isInit ? (
              <Suspense fallback={<Loading></Loading>}>
                <AlliApps onSelect={selectApp}></AlliApps>
              </Suspense>
            ) : (
              <Loading></Loading>
            )
          ) : (
            <AppContents
              ref={(el) => {
                if (el && streamingStatus === 'streaming') {
                  el.scrollTo(0, el.scrollHeight);
                }
              }}>
              <AppName>{selectedApp.name}</AppName>
              <AppDesc>{selectedApp.description}</AppDesc>
              {inputComponents && inputComponents}
              {result && (
                <ResultArea>
                  <Divider sx={{ margin: '32px 0px' }} />
                  <ResultTitle>{t('Result')}</ResultTitle>
                  <RunResult>
                    <PreMarkdown text={result} />
                  </RunResult>
                  <Button
                    disable={streamingStatus !== 'none'}
                    variant="gray"
                    width={'full'}
                    height={40}
                    cssExt={css`
                      background-color: #ede5fe;
                      border: solid 1px #9d75ec;
                      font-size: 13px;
                      font-weight: 700;
                      line-height: 20px;
                      letter-spacing: 0px;
                      text-align: center;
                      color: #6f3ad0;
                    `}
                    onClick={async () => {
                      if (isSlideNoteApp(selectedApp.id)) {
                        Bridge.callSyncBridgeApiWithCallback({
                          api: 'insertNote',
                          arg: JSON.stringify({ slide_number: insertSlideNum, note: result }),
                          callback: (ret) => {
                            try {
                              const { success, message } = ret;
                              dispatch(
                                activeToast({ type: success ? 'info' : 'error', msg: message })
                              );
                            } catch (err) {}
                          }
                        });
                      } else {
                        insertDoc(result);
                        dispatch(activeToast({ type: 'info', msg: t(`ToastMsg.CompleteInsert`) }));
                      }
                    }}>
                    {isSlideNoteApp(selectedApp.id)
                      ? `${t('Alli.insertNote', { page: insertSlideNum })}`
                      : t('WriteTab.InsertDoc')}
                  </Button>
                </ResultArea>
              )}
              <PoweredBy>Powered By Alli</PoweredBy>
              <Footer>
                <RefreshArea>
                  <RefreshButton
                    disabled={streamingStatus !== 'none'}
                    onClick={() => {
                      refresh(selectedApp);
                    }}>
                    <img src={AppIconRefresh} width={15} height={15} alt="refresh"></img>
                  </RefreshButton>
                </RefreshArea>
                <Buttons>
                  <Button
                    variant="gray"
                    width={'full'}
                    height={40}
                    onClick={() => {
                      if (streamingStatus !== 'none') {
                        onClickStop();
                      } else {
                        goBack();
                      }
                    }}>
                    {streamingStatus !== 'none' ? t('StopGenerate') : t('Back')}
                  </Button>
                  <CreditButton
                    disable={
                      streamingStatus !== 'none' ||
                      hasEmpty(inputs) ||
                      (isSlideNoteApp(selectedApp.id) && refSlideNum === 0)
                    }
                    variant="purpleGradient"
                    width={'full'}
                    height={40}
                    onClick={() => {
                      if (result) setResult('');
                      if (isSlideNoteApp(selectedApp.id)) setInsertSlideNum(refSlideNum);
                      requestAlliRun(selectedApp.id, inputs);
                    }}>
                    {result ? t('Regenerate') : t('Generate')}
                  </CreditButton>
                </Buttons>
              </Footer>
            </AppContents>
          )}
          {streamingStatus === 'request' && (
            <MakingOverlap>
              <Loading></Loading>
            </MakingOverlap>
          )}
        </Body>
      </Wrapper>
    </ThemeProvider>
  );
}

export const isSlideNoteApp = (appId: string) => {
  const AlliAppID = JSON.parse(process.env.REACT_APP_ALLI_APPS ?? '{}');
  return Object.values(AlliAppID['AlliIconSlideNote']).includes(appId);
};
