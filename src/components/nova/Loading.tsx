import { useTranslation } from 'react-i18next';
import Lottie from 'react-lottie-player';
import { getDriveFiles } from 'store/slices/uploadFiles';
import styled from 'styled-components';

import BlurDarkIcon from '../../img/dark/nova/ico_bg_blur_loading.svg';
import SpinnerDark from '../../img/dark/nova/nova_spinner.json';
import BlurLightIcon from '../../img/light/nova/ico_bg_blur_loading.png';
import SpinnerLight from '../../img/light/nova/nova_spinner.json';
import { selectTabSlice } from '../../store/slices/tabSlice';
import { themeInfoSelector } from '../../store/slices/theme';
import { useAppSelector } from '../../store/store';

const Background = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background-image: ${({ theme }) =>
    `url(${theme.mode === 'light' ? BlurLightIcon : BlurDarkIcon})`};
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;

  img {
    transform: scale(0.5);
  }

  span {
    font-size: 16px;
    font-weight: 500;
    line-height: 24px;
    color: ${({ theme }) => theme.color.text.main02};
  }
`;

export default function Loading() {
  const { t } = useTranslation();
  const { isLightMode } = useAppSelector(themeInfoSelector);
  const { selectedNovaTab } = useAppSelector(selectTabSlice);

  const drivesFiles = useAppSelector(getDriveFiles);
  const isDrivesFiles = drivesFiles.length > 0;

  const getSelectedTab = () => {
    if (selectedNovaTab === 'translation') {
      if (isDrivesFiles) {
        return t(`Nova.${selectedNovaTab}.FileLoading`);
      }
    }
    return t(`Nova.${selectedNovaTab}.Loading`);
  };

  return (
    <Background>
      <Lottie
        animationData={isLightMode ? SpinnerLight : SpinnerDark}
        loop
        play
        style={{ width: 56, height: 56 }}
      />
      <span>{getSelectedTab()}</span>
    </Background>
  );
}
