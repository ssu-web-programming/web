import { useNavigate } from 'react-router-dom';
import { getLangCodeFromParams, getLangCodeFromUA, LANG_EN_US, LANG_KO_KR } from '../../locale';
import { useLocation } from 'react-router';

const useLangParameterNavigate = () => {
  const navigator = useNavigate();
  const location = useLocation();

  const paramLang = getLangCodeFromParams() || getLangCodeFromUA();
  const isLangKo = paramLang?.includes(LANG_KO_KR);

  const regex = /(?:\?|&)tesla=([^&]+)/;
  const match = location.search.match(regex);
  const isTesla = match ? JSON.parse(match[1]) : false;

  const navigate = (path: string) => {
    const langValue = isLangKo ? LANG_KO_KR : LANG_EN_US;
    return navigator(`${path}?lang=${langValue}&tesla=${isTesla}`);
  };

  return { navigate, isLangKo, isTesla };
};

export default useLangParameterNavigate;
