import { useEffect } from 'react';
import TagManager from 'react-gtm-module';
import { useLocation } from 'react-router';
import { useAppSelector } from '../../store/store';
import { filesSelector } from '../../store/slices/askDocAnalyzeFiesSlice';
import { getPlatform } from '../../util/bridge';

const useGtmPageChange = () => {
  const { userId } = useAppSelector(filesSelector);
  const location = useLocation();

  useEffect(() => {
    if (userId !== '') {
      const tagManagerArgs = {
        gtmId: process.env.REACT_APP_GTM_ID,
        dataLayer: {
          user_id: userId,
          userProject: 'AskDoc',
          page: 'home',
          page_path: location.pathname + '/',
          event: 'view_user_info',
          OSName: getPlatform() === 'unknown' ? 'web' : getPlatform()
        }
      };
      TagManager.dataLayer(tagManagerArgs);
    }
  }, [location, userId]);
  return null;
};

export default useGtmPageChange;
