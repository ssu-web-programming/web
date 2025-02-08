import { useEffect, useState } from 'react';
import translationHttp from 'api/translation';

import { LangType } from '../../provider/translation-provider';

export default function useLangSearch(langType: LangType) {
  const [latestLangList, setLatestLangList] = useState<string[]>([]);

  const fetchLatestLang = async () => {
    const result = await translationHttp.postTranslateLatestLang();
    const { sourceLanguages, targetLanguages } = result.data;
    setLatestLangList(langType === 'source' ? sourceLanguages : targetLanguages);
    return result;
  };

  useEffect(() => {
    fetchLatestLang();
  }, []);

  return { latestLangList };
}
