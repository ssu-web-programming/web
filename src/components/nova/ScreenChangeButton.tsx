import { ReactComponent as MaxDarkIcon } from 'img/dark/nova/ico_max.svg';
import { ReactComponent as MinDarkIcon } from 'img/dark/nova/ico_min.svg';
import { ReactComponent as MaxLightIcon } from 'img/light/nova/ico_max.svg';
import { ReactComponent as MinLightIcon } from 'img/light/nova/ico_min.svg';

import {
  selectPageCreditReceived,
  selectPageService
} from '../../store/slices/nova/pageStatusSlice';
import { ClientType, DeviceType, platformInfoSelector } from '../../store/slices/platformInfo';
import { screenModeSelector, setScreenMode } from '../../store/slices/screenMode';
import { selectTabSlice } from '../../store/slices/tabSlice';
import { themeInfoSelector } from '../../store/slices/theme';
import { useAppDispatch, useAppSelector } from '../../store/store';
import Bridge, { isDesktop } from '../../util/bridge';
import IconButton from '../buttons/IconButton';
import UseShowSurveyModal from '../hooks/use-survey-modal';
import useLangParameterNavigate from '../hooks/useLangParameterNavigate';

export const ScreenChangeButton = () => {
  const dispatch = useAppDispatch();
  const { isLightMode } = useAppSelector(themeInfoSelector);
  const { screenMode } = useAppSelector(screenModeSelector);
  const { platform, device } = useAppSelector(platformInfoSelector);
  const { from } = useLangParameterNavigate();

  const { selectedNovaTab } = useAppSelector(selectTabSlice);
  const isCreditRecieved = useAppSelector(selectPageCreditReceived(selectedNovaTab));
  const service = useAppSelector(selectPageService(selectedNovaTab));
  const showSurveyModal = UseShowSurveyModal();

  console.log('from: ', from);
  console.log('platform: ', platform);
  if (
    ((platform === ClientType.web ||
      platform === ClientType.windows ||
      platform === ClientType.mac) &&
      from === 'home') ||
    ((platform === ClientType.ios || platform === ClientType.android) &&
      device === DeviceType.phone)
  ) {
    return (
      <IconButton
        iconComponent={
          screenMode === 'min'
            ? isLightMode
              ? MaxLightIcon
              : MaxDarkIcon
            : isLightMode
              ? MinLightIcon
              : MinDarkIcon
        }
        onClick={async () => {
          const isShowModal = await showSurveyModal(selectedNovaTab, service, isCreditRecieved);
          if (isShowModal) return;

          Bridge.callBridgeApi('changeScreenSize', screenMode === 'min' ? 'max' : 'min');
          dispatch(setScreenMode(screenMode === 'min' ? 'max' : 'min'));
        }}
        iconSize="lg"
        width={32}
        height={32}
      />
    );
  }

  return null;
};
