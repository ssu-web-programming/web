import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router';

const useLangParameterNavigate = () => {
  const navigator = useNavigate();
  const location = useLocation();

  // const regex = /(?:\?|&)tesla=([^&]+)/;
  // const match = location.search.match(regex);
  // const isTesla = match ? JSON.parse(match[1]) : false;

  const params = new URLSearchParams(location.search);
  const isTesla = params.get('tesla') === 'true';
  const isObigo = params.get('obigo') === 'true';
  const from = params.get('from');

  const navigate = (path: string) => {
    return navigator(`${path}${location.search}`, { replace: true });
  };

  return { navigate, isTesla, isObigo, from };
};

export default useLangParameterNavigate;
