import styled, { css } from 'styled-components';
import Header from '../../components/layout/Header';
import { useTranslation } from 'react-i18next';
import { Suspense, useMemo, useRef, useState } from 'react';
import uiBuild from './builder';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Divider } from '@mui/material';
import { marked } from 'marked';

import AppIconRefresh from '../../img/alli/alli-icon-refresh.svg';

import Button from '../../components/buttons/Button';
import Bridge from '../../util/bridge';
import { useAppDispatch, useAppSelector } from '../../store/store';
import { initFlagSelector } from '../../store/slices/initFlagSlice';
import CreditButton from '../../components/buttons/CreditButton';
import Loading from '../../components/Loading';
import { ALLI_RESPONSE_STREAM_API } from '../../api/constant';
import { Requestor, requestChatStream, streaming } from '../../api';
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

export interface ResponseAppInputOption {
  name: string;
  value: string;
}

export interface ResponseAppInputInfo {
  name: string;
  inputType: string;
  value: string;
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

  const { isInit } = useAppSelector(initFlagSelector);
  const { selectedApp, createResult } = useAppSelector(selectAlliApps);

  const [inputs, setInputs] = useState<any>(createResult.inputs);
  const [result, setResult] = useState<string>(createResult.output);

  const [streamingStatus, setStreamingStatus] = useState<StreamingStatus>('none');

  const requestor = useRef<Requestor | null>(null);

  const selectApp = (appInfo: AppInfo) => {
    if (appInfo.inputs) {
      const initVal = appInfo.inputs.reduce((acc, cur) => {
        return {
          ...acc,
          [cur.value]:
            cur.value === 'language'
              ? cur.options.find((opt) => opt.value.toLowerCase().startsWith(lang))?.value
              : undefined
        };
      }, {});
      setInputs(initVal);
    }
    dispatch(setSelectedApp(appInfo));
  };

  const refresh = (appInfo?: AppInfo) => {
    dispatch(resetCreateResult());
    setInputs({});
    setResult('');
    if (appInfo) {
      selectApp(appInfo);
    }
  };

  const goBack = () => {
    refresh();
    dispatch(setSelectedApp(null));
  };

  const requestAlliRun = async (appId: string, inputs: any) => {
    let resultText = '';
    try {
      setStreamingStatus('request');
      const sessionInfo = await Bridge.checkSession('');
      try {
        requestor.current = requestChatStream(sessionInfo, {
          api: ALLI_RESPONSE_STREAM_API,
          arg: { inputs, appId, lang }
        });

        const res = await requestor.current.request();

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
          throw err;
        }
      } finally {
        requestor.current = null;
        dispatch(setCreateResult({ inputs, output: resultText }));
      }
    } catch (err) {
      errorHandle(err);
    } finally {
      setStreamingStatus('none');
    }
  };

  const onClickStop = () => {
    requestor.current?.abort();
    dispatch(activeToast({ type: 'info', msg: t(`ToastMsg.StopMsg`) }));
  };

  const hasEmpty = (inputs: any) =>
    Object.values(inputs).some((val) => val === undefined || val === '');

  const inputComponents = selectedApp ? uiBuild(selectedApp.inputs, setInputs, inputs) : undefined;

  const markedRenderer = useMemo(() => {
    const renderer = new marked.Renderer();
    renderer.link = (href, title, text) => `<a href="javascript:void(0)">${text}</a>`;
    return renderer;
  }, []);

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
                  <RunResult
                    ref={(el) => {
                      if (el) {
                        const html = marked(result, {
                          renderer: markedRenderer
                        });
                        el.innerHTML = html;
                      }
                    }}></RunResult>
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
                    onClick={() => {
                      insertDoc(result);
                      dispatch(activeToast({ type: 'info', msg: t(`ToastMsg.CompleteInsert`) }));
                    }}>
                    {t('WriteTab.InsertDoc')}
                  </Button>
                </ResultArea>
              )}
              <PoweredBy>Powered By Alli</PoweredBy>
              <Footer>
                <RefreshArea>
                  <RefreshButton disabled={streamingStatus !== 'none'}>
                    <img
                      src={AppIconRefresh}
                      width={15}
                      height={15}
                      onClick={() => refresh(selectedApp)}
                      alt="refresh"></img>
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
                    disable={streamingStatus !== 'none' || hasEmpty(inputs)}
                    variant="purpleGradient"
                    width={'full'}
                    height={40}
                    onClick={() => {
                      if (result) setResult('');
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
