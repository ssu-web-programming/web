import { ClientType } from '../../util/bridge';

const DOWNLOAD_URLS: Partial<Record<ClientType, string>> = {
  [ClientType.android]: 'market://details?id=com.infraware.office.link',
  [ClientType.ios]: 'https://itunes.apple.com/app/polaris-office-pdf-docs/id698070860',
  [ClientType.windows]: 'https://polarisoffice.com/ko/download',
  [ClientType.mac]: 'itms-apps://itunes.apple.com/app/id1098211970?mt=12'
};

export const getDownloadUrlByPlatform = (platform: ClientType): string => {
  return DOWNLOAD_URLS[platform] || '';
};
