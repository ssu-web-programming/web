import { useState } from 'react';
import NovaHeader from 'components/nova/Header';
import { ReactComponent as TransFile } from 'img/light/nova/translation/trans_file.svg';
import { ReactComponent as TransTxt } from 'img/light/nova/translation/trans_txt.svg';

import Toggle, { type ToggleOption } from './components/toggle';

export default function Translation() {
  const [activeId, setActiveId] = useState<string>('text');

  //   호진TODO: 선택된 상태에 따라서 color 변경작업 진행해야함!
  const options: ToggleOption[] = [
    { id: 'text', label: '텍스트 번역', icon: <TransTxt /> },
    { id: 'file', label: '파일 번역', icon: <TransFile /> }
  ];

  return (
    <>
      <NovaHeader />
      <Toggle options={options} activeId={activeId} onToggle={setActiveId} />
    </>
  );
}
