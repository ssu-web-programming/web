import styled from 'styled-components';
import useApiWrapper from '../../api/useApiWrapper';
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

interface AppListProps {
  onSelect: (app: AppInfo) => void;
}

export default function AppList(props: AppListProps) {
  const { onSelect } = props;

  const apiWrapper = useApiWrapper();

  const { data } = useSuspenseQuery<AppInfo[]>({
    queryKey: ['AlliApps'],
    queryFn: async () => {
      try {
        const { res } = await apiWrapper(`/api/v2/alli/apps?lang=${lang}`, {
          headers: {
            'content-type': 'application/json',
            'User-Agent': navigator.userAgent
          },
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
    </Wrapper>
  );
}
