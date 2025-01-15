import { useState } from 'react';
import NovaHeader from 'components/nova/Header';

import Toggle, { type ToggleOption } from './components/translation-toggle';

export default function Translation() {
  const [activeId, setActiveId] = useState<string>('option1');

  const options: ToggleOption[] = [
    { id: 'option1', label: '옵션1' },
    { id: 'option2', label: '옵션2' }
  ];

  return (
    <>
      <NovaHeader />
      <Toggle options={options} activeId={activeId} onToggle={setActiveId} />
    </>
  );
}
