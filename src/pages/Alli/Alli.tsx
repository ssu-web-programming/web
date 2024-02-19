import styled, { css } from 'styled-components';
import Header from '../../components/layout/Header';
import { useTranslation } from 'react-i18next';
import { useEffect, useRef, useState } from 'react';
import uiBuild from './builder';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Divider } from '@mui/material';
import { marked } from 'marked';
import { v4 as uuidv4 } from 'uuid';

import AppIconRefresh from '../../img/alli/alli-icon-refresh.svg';
import AlliIconCandidate from '../../img/alli/appIcon/alli-icon-candidate.svg';
import AlliIconCopyrighting from '../../img/alli/appIcon/alli-icon-copyrighting.svg';
import AlliIconCrew from '../../img/alli/appIcon/alli-icon-crew.svg';
import AlliIconEvent from '../../img/alli/appIcon/alli-icon-event.svg';
import AlliIconLaw from '../../img/alli/appIcon/alli-icon-law.svg';
import AlliIconManual from '../../img/alli/appIcon/alli-icon-manual.svg';
import AlliIconNoti from '../../img/alli/appIcon/alli-icon-noti.svg';
import AlliIconPrivacy from '../../img/alli/appIcon/alli-icon-privacy.svg';
import AlliIconPromotion from '../../img/alli/appIcon/alli-icon-promotion.svg';
import AlliIconPush from '../../img/alli/appIcon/alli-icon-push.svg';
import AlliIconSentence from '../../img/alli/appIcon/alli-icon-sentence.svg';
import AlliIconTranslator from '../../img/alli/appIcon/alli-icon-translator.svg';
import AlliIconWelcome from '../../img/alli/appIcon/alli-icon-welcome.svg';
import AlliIconEmail from '../../img/alli/appIcon/alli-icon-email.svg';

import Button from '../../components/buttons/Button';
import useApiWrapper from '../../api/useApiWrapper';
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
import {
  LANG_EN_US,
  convertLangFromLangCode,
  getLangCodeFromParams,
  getLangCodeFromUA
} from '../../locale';

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
`;

const AppContents = styled.div`
  width: 100%;

  display: flex;
  flex-direction: column;
  flex: 1;

  padding: 0px 24px;

  overflow-y: auto;

  position: relative;
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

const AppList = styled.ul`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;

  padding: 0px 24px;

  overflow-y: auto;
`;

const AppItemWrapper = styled.li`
  list-style: none;
  margin: 0;
`;

const AppItem = styled.div`
  width: 100%;
  padding: 20px 0px;

  display: flex;
  flex-direction: row;
  align-items: center;

  &:hover {
    cursor: pointer;
  }
`;

const AppDetail = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  text-align: left;

  margin-left: 12px;

  div:first-child {
    font-size: 16px;
    font-weight: 700;
    line-height: 24px;
    letter-spacing: -0.04em;
    margin-bottom: 4px;
  }

  font-size: 13px;
  font-weight: 400;
  line-height: 20px;
  letter-spacing: -0.02em;
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

interface AppInfo {
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

interface AppComponent extends AppInfo {
  component?: React.ReactNode;
}

type AlliAppIcon = {
  id: {
    ko: string;
    en: string;
  };
  icon: string;
};

const AlliAppIcons: AlliAppIcon[] = [
  {
    id: {
      ko: 'TExNQXBwOjY1YWE1NGFlOTU1MGU3YmU1ZmY4NTM1ZA==',
      en: 'TExNQXBwOjY1Y2VmMWIzNDcwOWJhMDY5NzlhMGUyZg=='
    },
    icon: AlliIconCandidate
  },
  {
    id: {
      ko: 'TExNQXBwOjY1YWE1NWJlZWZlZGI3ODEyNjI1YWZjMA==',
      en: 'TExNQXBwOjY1Y2VmNGYzZjlhMmVlMTE4ZDg3OTZmMA=='
    },
    icon: AlliIconCopyrighting
  },
  {
    id: {
      ko: 'TExNQXBwOjY1YWE1NGNjN2M0ZWFhNDJlZmNjMTRlZg==',
      en: 'TExNQXBwOjY1Y2VmMmM4MTIxMGQ2MzRlODNhMzBjZg=='
    },
    icon: AlliIconCrew
  },
  {
    id: {
      ko: 'TExNQXBwOjY1YWE1NjYzZGY3ZDA0OTlkNGM2N2EzZg==',
      en: 'TExNQXBwOjY1Y2VmOGIxNDcwOWJhMDY5NzlmNGE3ZA=='
    },
    icon: AlliIconEvent
  },
  {
    id: {
      ko: 'TExNQXBwOjY1NjU0MzdmM2YxNGI4ZjE4MjhhNTJmNA==',
      en: 'TExNQXBwOjY1Y2VlZjA0YWRlYWY3NWMxZmIyYWI2ZQ=='
    },
    icon: AlliIconLaw
  },
  {
    id: {
      ko: 'TExNQXBwOjY1ODNkN2ZlYmI0NmNkYzM1ZTYwMWQxMg==',
      en: 'TExNQXBwOjY1Y2VmZDA2ZjlhMmVlMTE4ZDhiMTljMw=='
    },
    icon: AlliIconManual
  },
  {
    id: {
      ko: 'TExNQXBwOjY1YWE1NGMxYWM0ZjdlYTdjMWE0NTUxZA==',
      en: 'TExNQXBwOjY1Y2VmNTljMDdlZGU1MWM2YmYxNzEyMA=='
    },
    icon: AlliIconNoti
  },
  {
    id: {
      ko: 'TExNQXBwOjY1YWE1NDA1ZWM2N2Q2NGEzOTlmNTJlOA==',
      en: 'TExNQXBwOjY1Y2VlZmU2ZmI5MDBjZDczYWZlYWIzZQ=='
    },
    icon: AlliIconPrivacy
  },
  {
    id: {
      ko: 'TExNQXBwOjY1YWE1NGVhNTE0YzlhNTAzMGZjODg5NA==',
      en: 'TExNQXBwOjY1Y2VmNzAyZTljYzBlZTJiNTBlMTBkNw=='
    },
    icon: AlliIconPromotion
  },
  {
    id: {
      ko: 'TExNQXBwOjY1YWE1NTlhYzM4NTBlZWZkZjM1MmQ0Ng==',
      en: 'TExNQXBwOjY1Y2VmOTQxZDg2OTk2MThjY2RjYTAzOA=='
    },
    icon: AlliIconPush
  },
  {
    id: {
      ko: 'TExNQXBwOjY1ODNmMmYyZWU1ZGIzMjdhOWU1NjYzYw==',
      en: 'TExNQXBwOjY1Y2VmMGQ0OWZlNzQ0NjdjZDJjNmU1Mg=='
    },
    icon: AlliIconSentence
  },
  {
    id: {
      ko: 'TExNQXBwOjY1YWE1NTgzZDI5YWRhYWEzOTc5N2IxMg==',
      en: 'TExNQXBwOjY1Y2VmODUxZDgwZGNhZTMwMDZhYjM3ZA=='
    },
    icon: AlliIconTranslator
  },
  {
    id: {
      ko: 'TExNQXBwOjY1YWE1NThlZDI5YWRhYWEzOTc5ODVjNQ==',
      en: 'TExNQXBwOjY1Y2VmMzNmZDg2OTk2MThjY2Q5ZmE0NQ=='
    },
    icon: AlliIconWelcome
  },
  {
    id: {
      ko: 'TExNQXBwOjY1YWE1NTc0ZDI3ZDNlMjcwNjI2ZDQ1MQ==',
      en: 'TExNQXBwOjY1Y2VlZWEzNDEzYTE5ZjcwOTdlMWFiYQ=='
    },
    icon: AlliIconEmail
  }
];

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
  const apiWrapper = useApiWrapper();

  const { isInit } = useAppSelector(initFlagSelector);
  const showCreditToast = useShowCreditToast();
  const errorHandle = useErrorHandle();

  const [appList, setAppList] = useState<AppInfo[]>([]);
  const [selectedApp, setSelectedApp] = useState<AppComponent>();

  const [uuid, setUuid] = useState<string>('');

  const [inputs, setInputs] = useState<any>({});
  const [result, setResult] = useState<string>('');

  const [streamingStatus, setStreamingStatus] = useState<StreamingStatus>('none');

  const requestor = useRef<Requestor | null>(null);

  const getlang = () => {
    try {
      const paramLang = getLangCodeFromParams() || getLangCodeFromUA();
      return convertLangFromLangCode(paramLang) || LANG_EN_US;
    } catch (err) {
      return LANG_EN_US;
    }
  };
  const lang = getlang();

  const selectApp = (appInfo: AppInfo) => {
    if (appInfo.inputs) {
      setSelectedApp({
        ...appInfo,
        component: uiBuild(appInfo.inputs, setInputs)
      });
      const initVal = appInfo.inputs.reduce((acc, cur) => ({ ...acc, [cur.value]: undefined }), {});
      setInputs(initVal);
    }
  };

  const refresh = (appInfo?: AppInfo) => {
    setInputs({});
    setResult('');
    setUuid(uuidv4());
    if (appInfo) {
      selectApp(appInfo);
    }
  };

  const goBack = () => {
    refresh();
    setSelectedApp(undefined);
  };

  const getAppList = async () => {
    try {
      const { res } = await apiWrapper(`/api/v2/alli/apps?lang=${lang}`, {
        headers: {
          'content-type': 'application/json',
          'User-Agent': navigator.userAgent
        },
        method: 'GET'
      });
      const resJson = await res.json();
      return resJson.data.appList;
    } catch (e) {
      console.log(e);
    }
  };

  const makeAppListIcon = (appList: AppInfo[]) => {
    const ret = appList.map((appInfo: AppInfo) => {
      return {
        ...appInfo,
        icon: AlliAppIcons.find((icon) => icon.id[lang] === appInfo.id)?.icon
      };
    });
    return ret;
  };

  const initialize = async () => {
    const responseList = await getAppList();
    const appList = makeAppListIcon(responseList);
    setAppList(appList);
  };

  useEffect(() => {
    if (isInit === true) {
      initialize();
    }
  }, [isInit]);

  const requestAlliRun = async (appId: string, inputs: any) => {
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
        });
      } catch (err) {
        if (requestor.current?.isAborted() === true) {
        } else {
          throw err;
        }
      } finally {
        requestor.current = null;
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

  return (
    <ThemeProvider theme={theme}>
      <Wrapper>
        <Header title={t('AITools')} subTitle={'AI Apps'}></Header>
        <Body>
          {!selectedApp ? (
            <AppList>
              {appList.length > 0 ? (
                appList.map((item, index) => (
                  <AppItemWrapper key={item.name}>
                    {index !== 0 && <Divider />}
                    <AppItem onClick={() => selectApp(item)}>
                      <img src={item.icon} alt="" width={24} height={24}></img>
                      <AppDetail>
                        <div>{item.name}</div>
                        <div>{item.description}</div>
                      </AppDetail>
                    </AppItem>
                  </AppItemWrapper>
                ))
              ) : (
                <Loading></Loading>
              )}
              <PoweredBy>Powered By Alli</PoweredBy>
            </AppList>
          ) : (
            <AppContents
              ref={(el) => {
                if (el && streamingStatus === 'streaming') {
                  el.scrollTo(0, el.scrollHeight);
                }
              }}>
              <AppName>{selectedApp.name}</AppName>
              <AppDesc>{selectedApp.description}</AppDesc>
              {selectedApp?.component && <div key={uuid}>{selectedApp.component}</div>}
              {result && (
                <ResultArea>
                  <Divider sx={{ margin: '32px 0px' }} />
                  <ResultTitle>{t('Result')}</ResultTitle>
                  <RunResult
                    ref={(el) => {
                      if (el) {
                        const html = marked(result);
                        el.innerHTML = html;
                      }
                    }}></RunResult>
                  <Button
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
                  <RefreshButton
                    disabled={streamingStatus !== 'none'}
                    style={{ backgroundColor: '#6F3AD0', width: '40px', height: '40px' }}>
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
              {streamingStatus === 'request' && (
                <MakingOverlap>
                  <Loading></Loading>
                </MakingOverlap>
              )}
            </AppContents>
          )}
        </Body>
      </Wrapper>
    </ThemeProvider>
  );
}
