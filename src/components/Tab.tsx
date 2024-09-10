import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  font-size: 13px;
  font-weight: 500;

  color: var(--ai-purple-50-main);
  word-break: keep-all;
  text-align: center;
  gap: 8px;
`;

interface TabProps {
  tabs: [];
  activeTab: '';
  onTabChange: (tab: []) => void;
}

const Tab = ({ tabs, activeTab, onTabChange }: TabProps) => {
  const { t } = useTranslation();
  const getTabTranslationKey = (tab: string): string => {
    return `tabs.${tab}`;
  };

  return (
    <nav>
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => onTabChange(tab)}
          style={{ fontWeight: activeTab === tab ? 'bold' : 'normal' }}>
          {t(getTabTranslationKey(tab))}
        </button>
      ))}
    </nav>
  );
};

export default Tab;
