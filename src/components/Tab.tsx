import { useTranslation } from 'react-i18next';

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
