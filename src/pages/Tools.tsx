import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import styled from 'styled-components';

import {
  DEFAULT_WRITE_OPTION_FORM_VALUE,
  DEFAULT_WRITE_OPTION_LENGTH_VALUE,
  versionClova,
  versionGpt4_1,
  WriteOptions
} from '../components/chat/RecommendBox/FormRec';
import Header from '../components/layout/Header';
import { lang, LANG_KO_KR } from '../locale';
import { getCurrentFile } from '../store/slices/uploadFiles';
import store, { useAppSelector } from '../store/store';
import Bridge from '../util/bridge';
import AIWriteTab from '../views/AIWriteTab';

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

const initVersion = lang === LANG_KO_KR ? versionClova : versionGpt4_1;

const initWriteOptions: WriteOptions = {
  input: '',
  version: initVersion,
  form: DEFAULT_WRITE_OPTION_FORM_VALUE,
  length: DEFAULT_WRITE_OPTION_LENGTH_VALUE
};

export default function Tools() {
  const { t } = useTranslation();
  const location = useLocation();
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
    <Wrapper>
      <Header title={t('AITools')} subTitle={'AI Write'}></Header>
      <Body>
        <AIWriteTab options={writeOptions} setOptions={setWriteOptions} />
      </Body>
    </Wrapper>
  );
}
