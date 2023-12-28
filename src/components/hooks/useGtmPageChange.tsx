import { useEffect } from 'react';
import TagManager from 'react-gtm-module';
import { useLocation } from 'react-router';
import { useAppSelector } from '../../store/store';
import { filesSelector } from '../../store/slices/askDocAnalyzeFiesSlice';

const useGtmPageChange = () => {
  const { userId } = useAppSelector(filesSelector);
  const location = useLocation();

  useEffect(() => {
    if (userId !== '') {
      const tagManagerArgs = {
        gtmId: process.env.REACT_APP_GTM_ID,
        dataLayer: {
          userId,
          userProject: 'project',
          page: 'home',
          event: 'view_user_info'
        }
      };
      TagManager.dataLayer(tagManagerArgs);
    }
  }, [location, userId]);
  return null;
};

export default useGtmPageChange;
