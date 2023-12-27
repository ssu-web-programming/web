import { useLocation, useNavigate } from 'react-router-dom';
import { getLangCodeFromParams, getLangCodeFromUA, LANG_KO_KR } from '../../locale';

const useLangParameterNavigate = () => {
  const navigator = useNavigate();
  const location = useLocation();

  const paramLang = getLangCodeFromParams() || getLangCodeFromUA();
  const isLangKo = paramLang?.includes(LANG_KO_KR);

  const navigate = (path: string) => {
    const regex = /(?:\?|&)lang=([^&]+)/;
    const match = location.search.match(regex);
    const langValue = match ? match[1] : null;

    return navigator(`${path}?lang=${langValue}`);
  };

  return { navigate, isLangKo };
};

export default useLangParameterNavigate;
