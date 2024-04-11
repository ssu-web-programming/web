import styled from 'styled-components';
import { apiWrapper } from '../../api/apiWrapper';
import { lang } from '../../locale';
import { Divider } from '@mui/material';
import { AppInfo } from './Alli';
import { useSuspenseQuery } from '@tanstack/react-query';

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
import AlliIconGoodWord from '../../img/alli/appIcon/alli-icon-good-word.svg';

const Wrapper = styled.ul`
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

type AlliAppIcon = {
  id: {
    ko: string;
    en: string;
    ja: string;
  };
  icon: string;
};

const AlliAppIcons: AlliAppIcon[] = [
  {
    name: 'AlliIconCandidate',
    icon: AlliIconCandidate
  },
  {
    name: 'AlliIconCopyrighting',
    icon: AlliIconCopyrighting
  },
  {
    name: 'AlliIconCrew',
    icon: AlliIconCrew
  },
  {
    name: 'AlliIconEvent',
    icon: AlliIconEvent
  },
  {
    name: 'AlliIconLaw',
    icon: AlliIconLaw
  },
  {
    name: 'AlliIconManual',
    icon: AlliIconManual
  },
  {
    name: 'AlliIconNoti',
    icon: AlliIconNoti
  },
  {
    name: 'AlliIconPrivacy',
    icon: AlliIconPrivacy
  },
  {
    name: 'AlliIconPromotion',
    icon: AlliIconPromotion
  },
  {
    name: 'AlliIconPush',
    icon: AlliIconPush
  },
  {
    name: 'AlliIconSentence',
    icon: AlliIconSentence
  },
  {
    name: 'AlliIconTranslator',
    icon: AlliIconTranslator
  },
  {
    name: 'AlliIconWelcome',
    icon: AlliIconWelcome
  },
  {
    name: 'AlliIconEmail',
    icon: AlliIconEmail
  },
  {
    name: 'AlliIconGoodWord',
    icon: AlliIconGoodWord
  }
].map((item) => {
  const AlliAppID = JSON.parse(process.env.REACT_APP_ALLI_APPS ?? '{}');
  const appId = AlliAppID[item.name];
  return {
    ...item,
    id: {
      ...appId
    }
  };
});

interface AppListProps {
  onSelect: (app: AppInfo) => void;
}

export default function AppList(props: AppListProps) {
  const { onSelect } = props;

  const { data } = useSuspenseQuery<AppInfo[]>({
    queryKey: ['AlliApps'],
    queryFn: async () => {
      try {
        const { res } = await apiWrapper().request(`/api/v2/alli/apps?lang=${lang}`, {
          method: 'GET'
        });
        return (await res.json()).data.appList.map((appInfo: AppInfo) => ({
          ...appInfo,
          icon: AlliAppIcons.find((icon) => icon.id[lang] === appInfo.id)?.icon
        }));
      } catch (err) {
        throw err;
      }
    },
    staleTime: Infinity
  });

  return (
    <Wrapper>
      {data.map((item, index) => (
        <AppItemWrapper key={item.name}>
          {index !== 0 && <Divider />}
          <AppItem onClick={() => onSelect(item)}>
            <img src={item.icon} alt="icon" width={24} height={24}></img>
            <AppDetail>
              <div>{item.name}</div>
              <div>{item.description}</div>
            </AppDetail>
          </AppItem>
        </AppItemWrapper>
      ))}
      <PoweredBy>Powered By Alli</PoweredBy>
    </Wrapper>
  );
}
