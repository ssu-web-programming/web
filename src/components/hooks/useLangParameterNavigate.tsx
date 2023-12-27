import { useLocation, useNavigate } from 'react-router-dom';

const useLangParameterNavigate = () => {
  const navigator = useNavigate();
  const location = useLocation();

  const navigate = (path: string) => {
    const regex = /(?:\?|&)lang=([^&]+)/;
    const match = location.search.match(regex);
    const langValue = match ? match[1] : null;

    return navigator(`${path}?lang=${langValue}`);
  };

  return { navigate };
};

export default useLangParameterNavigate;
