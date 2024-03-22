import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router';

const useLangParameterNavigate = () => {
  const navigator = useNavigate();
  const location = useLocation();

  const regex = /(?:\?|&)tesla=([^&]+)/;
  const match = location.search.match(regex);
  const isTesla = match ? JSON.parse(match[1]) : false;

  const navigate = (path: string) => {
    return navigator(`${path}${location.search}`);
  };

  return { navigate, isTesla };
};

export default useLangParameterNavigate;
