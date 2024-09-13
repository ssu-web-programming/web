import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

import aiChatIcon from '../../img/nova/tab/tab_aiChat_n.png';
import aiChatSelectedIcon from '../../img/nova/tab/tab_aiChat_s.png';
import changeBGIcon from '../../img/nova/tab/tab_changeBG_n.png';
import changeBGSelectedIcon from '../../img/nova/tab/tab_changeBG_s.png';
import changeStyleIcon from '../../img/nova/tab/tab_changeStyle_n.png';
import changeStyleSelectedIcon from '../../img/nova/tab/tab_changeStyle_s.png';
import expandImgIcon from '../../img/nova/tab/tab_expandImg_n.png';
import expandImgSelectedIcon from '../../img/nova/tab/tab_expandImg_s.png';
import improvedResIcon from '../../img/nova/tab/tab_improvedRes_n.png';
import improvedResSelectedIcon from '../../img/nova/tab/tab_improvedRes_s.png';
import remakeImgIcon from '../../img/nova/tab/tab_remakeImg_n.png';
import remakeImgSelectedIcon from '../../img/nova/tab/tab_remakeImg_s.png';
import removeBGIcon from '../../img/nova/tab/tab_removeBG_n.png';
import removeBGSelectedIcon from '../../img/nova/tab/tab_removeBG_s.png';
import { NOVA_TAB_TYPE } from '../../store/slices/tabSlice';

const iconMap: Record<NOVA_TAB_TYPE, { default: string; selected: string }> = {
  aiChat: { default: aiChatIcon, selected: aiChatSelectedIcon },
  removeBG: { default: removeBGIcon, selected: removeBGSelectedIcon },
  changeBG: { default: changeBGIcon, selected: changeBGSelectedIcon },
  remakeImg: { default: remakeImgIcon, selected: remakeImgSelectedIcon },
  expandImg: { default: expandImgIcon, selected: expandImgSelectedIcon },
  improvedRes: { default: improvedResIcon, selected: improvedResSelectedIcon },
  changeStyle: { default: changeStyleIcon, selected: changeStyleSelectedIcon }
};

const Wrap = styled.nav`
  width: 100%;
  height: 52px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 8px;
  padding: 8px 16px;
  overflow-x: auto;
  overflow-y: hidden;
  scrollbar-width: none;
  background-color: rgb(244, 246, 248);

  ::-webkit-scrollbar {
    display: none;
  }

  white-space: nowrap;
  z-index: 1;
`;

const Tap = styled.div<{ isHighlighted: boolean }>`
  width: fit-content;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 7.5px 12px 7.5px 8px;
  border: 1px solid ${(props) => (props.isHighlighted ? '#c6a9ff' : '#c9cdd2')};
  border-radius: 8px;
  background-color: ${(props) => (props.isHighlighted ? '#ede5fe' : 'white')};
  cursor: pointer;
`;

const Text = styled.div<{ isHighlighted: boolean }>`
  font-size: 14px;
  font-weight: ${(props) => (props.isHighlighted ? 500 : 400)};
  color: ${(props) => (props.isHighlighted ? '#511bb2' : 'black')};
`;

interface TabProps {
  tabs: NOVA_TAB_TYPE[];
  activeTab: string;
  onChangeTab: (tab: NOVA_TAB_TYPE) => void;
}

const Tabs = ({ tabs, activeTab, onChangeTab }: TabProps) => {
  const { t } = useTranslation();

  const getTabTranslationKey = (tab: NOVA_TAB_TYPE): string => {
    return `Nova.Tabs.${tab}`;
  };

  const getIcon = (tab: NOVA_TAB_TYPE, isSelected: boolean): string => {
    return isSelected ? iconMap[tab].selected : iconMap[tab].default;
  };

  return (
    <Wrap>
      {tabs.map((tab) => (
        <Tap key={tab} onClick={() => onChangeTab(tab)} isHighlighted={activeTab === tab}>
          <img src={getIcon(tab, activeTab === tab)} alt="logo" />
          <Text isHighlighted={activeTab === tab}>{t(getTabTranslationKey(tab))}</Text>
        </Tap>
      ))}
    </Wrap>
  );
};

export default Tabs;
