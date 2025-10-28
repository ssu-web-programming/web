import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import styled from 'styled-components';

import {
  DEFAULT_WRITE_OPTION_FORM_VALUE,
  DEFAULT_WRITE_OPTION_LENGTH_VALUE,
  versionGpt5,
  WriteOptions
} from '../components/chat/RecommendBox/FormRec';
import Header from '../components/layout/Header';
import LockAndKeyIcon from '../img/common/lock_and_key.png';
import { appStateSelector } from '../store/slices/appState';
import { getCurrentFile } from '../store/slices/uploadFiles';
import { useAppSelector } from '../store/store';
import Bridge from '../util/bridge';
import AIWriteTab from '../views/AIWriteTab';

import * as S from './Nova/Nova/style';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;

  width: 100%;
  height: 100%;
`;

const Body = styled.div`
  flex: 1;
  overflow: auto;
`;

const initWriteOptions: WriteOptions = {
  input: '',
  version: versionGpt5,
  form: DEFAULT_WRITE_OPTION_FORM_VALUE,
  length: DEFAULT_WRITE_OPTION_LENGTH_VALUE
};

export default function Tools() {
  const { t } = useTranslation();
  const location = useLocation();
  const { isNotLogin } = useAppSelector(appStateSelector);
  const currentFile = useAppSelector(getCurrentFile);

  const [writeOptions, setWriteOptions] = useState<WriteOptions>(initWriteOptions);

  useEffect(() => {
    if (location.state?.body) {
      setWriteOptions({ ...writeOptions, input: location.state?.body });
    }
  }, [location.state?.body]);

  useEffect(() => {
    if (currentFile.type === 'unknown') {
      Bridge.callBridgeApi('analyzeCurFile');
    }
  }, []);

  return (
    <>
      {isNotLogin && (
        <S.Dim>
          <S.LoginWrap>
            <img src={LockAndKeyIcon} alt="lock_and_key" />
            <p
              dangerouslySetInnerHTML={{ __html: t('Nova.Home.requestLogin') || '' }}
              onClick={() => Bridge.callBridgeApi('requestLogin')}
            />
          </S.LoginWrap>
        </S.Dim>
      )}
      <Wrapper>
        <Header title={t('AITools')} subTitle={'AI Write'}></Header>
        <Body>
          <AIWriteTab options={writeOptions} setOptions={setWriteOptions} />
        </Body>
      </Wrapper>
    </>
  );
}
