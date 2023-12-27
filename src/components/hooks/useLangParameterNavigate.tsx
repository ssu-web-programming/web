import { useNavigate } from 'react-router-dom';
import { getLangCodeFromParams, getLangCodeFromUA, LANG_EN_US, LANG_KO_KR } from '../../locale';

const useLangParameterNavigate = () => {
  const navigator = useNavigate();

  const paramLang = getLangCodeFromParams() || getLangCodeFromUA();
  const isLangKo = paramLang?.includes(LANG_KO_KR);

  const navigate = (path: string) => {
    const langValue = isLangKo ? LANG_KO_KR : LANG_EN_US;
    return navigator(`${path}?lang=${langValue}`);
  };

  return { navigate, isLangKo };
};

export default useLangParameterNavigate;
