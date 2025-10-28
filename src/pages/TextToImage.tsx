import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router';
import styled from 'styled-components';

import Header from '../components/layout/Header';
import LockAndKeyIcon from '../img/common/lock_and_key.png';
import { appStateSelector } from '../store/slices/appState';
import { getCurrentFile } from '../store/slices/uploadFiles';
import { useAppSelector } from '../store/store';
import Bridge from '../util/bridge';
import ImageCreate from '../views/ImageCreate';

import * as S from './Nova/Nova/style';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;

  width: 100%;
  height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
`;

const Body = styled.div`
  display: flex;
  flex-shrink: 1;
  flex-grow: 1;
`;

const TextToImage = () => {
  const location = useLocation();
  const { t } = useTranslation();
  const { isNotLogin } = useAppSelector(appStateSelector);
  const currentFile = useAppSelector(getCurrentFile);

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
        <Header title={t('AITools')} subTitle={t('TextToImage')}></Header>
        <Body>
          <ImageCreate contents={location.state?.body || ''} />
        </Body>
      </Wrapper>
    </>
  );
};

export default TextToImage;
