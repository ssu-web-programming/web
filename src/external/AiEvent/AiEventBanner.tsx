import styled from 'styled-components';
import banner from '../../img/AiEventBanner/pc_communication_banner.png';
import banner_eng from '../../img/AiEventBanner/pc_communication_banner_eng.png';
import banner2 from '../../img/AiEventBanner/banner_ai.png';
import { LANG_KO_KR, getLangCodeFromParams, getLangCodeFromUA } from '../../locale';
import { openNewWindow } from '../../util/common';
import Bridge, { ClientType, getPlatform } from '../../util/bridge';
import { useEffect } from 'react';
import usePostSplunkLog, { SplunkData } from '../../api/usePostSplunkLog';
import { ERR_INVALID_SESSION, ERR_NOT_ONLINE } from '../../error/error';

const BannerWrapper = styled.div`
  width: 100%;
  background-color: #511bb2;
  height: fit-content;
  display: flex;
  justify-content: center;

  &:hover {
    cursor: pointer;
  }

  img {
    display: flex;
    /* width: 320px; */
    height: 60px;
  }
`;

export const AI_EVENT_BANNER_TARGET_LEVEL = '1'; // level 1 is free plan user

const AiEventBanner = ({ tab }: { tab: 'ai.write' | 'ai.text_to_image' | 'ai.ask_doc' }) => {
  // const paramLang = getLangCodeFromParams() || getLangCodeFromUA();
  // const isLangKo = paramLang?.includes(LANG_KO_KR);

  async function getLogger(logger = usePostSplunkLog) {
    try {
      if (!navigator.onLine) {
        throw new Error(ERR_NOT_ONLINE);
      }
      const resSession = await Bridge.checkSession('');
      if (!resSession || !resSession.success) {
        throw new Error(ERR_INVALID_SESSION);
      }

      const AID = resSession.sessionInfo['AID'];
      const BID = resSession.sessionInfo['BID'];
      const SID = resSession.sessionInfo['SID'];

      const session: any = {};
      session['X-PO-AI-MayFlower-Auth-AID'] = AID;
      session['X-PO-AI-MayFlower-Auth-BID'] = BID;
      session['X-PO-AI-MayFlower-Auth-SID'] = SID;

      return { logger: logger({ bid: BID, sid: SID, ...resSession.userInfo }) };
    } catch (err: any) {
      throw err;
    }
  }

  const postSplunk = async (data: SplunkData) => {
    const { logger } = await getLogger();

    if (logger) {
      logger({ ...data });
    }
  };

  useEffect(() => {
    postSplunk({
      dp: tab,
      dt: 'communicationbanner',
      t: 'p'
    });
  }, []);

  const openEventPage = () => {
    const platform = getPlatform();

    const url = 'https://polarisoffice.com/ko/promotion/stamp';
    // isLangKo
    //   ? process.env.REACT_APP_AI_EVENT_URL_KO
    //   : process.env.REACT_APP_AI_EVENT_URL_EN;

    switch (platform) {
      case ClientType.android:
      case ClientType.ios:
      case ClientType.mac:
      case ClientType.windows:
        openNewWindow(url!);
        break;
      default:
        window.open(url, '_blank');
        break;
    }

    postSplunk({
      dp: tab,
      el: 'click',
      ec: 'ux',
      ea: 'cl',
      dt: 'communicationbanner',
      t: 'e'
    });
  };

  return (
    <BannerWrapper onClick={openEventPage}>
      <img src={banner2} alt={'ai event banner'} />
    </BannerWrapper>
  );
};

export default AiEventBanner;
