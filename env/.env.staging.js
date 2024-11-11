const REACT_APP_USE_LOGGER_SPLUNK = true;
const REACT_APP_USE_LOGGER_MODE_VF = true;
const GENERATE_SOURCEMAP = false;
const REACT_APP_SHARE_TECH_API = 'https://dev-was2.polarishare.com/api/v1/share/office/contents';
const REACT_APP_PO_API = 'https://vf-postatic.polarisoffice.com';
const REACT_APP_GTM_ID = 'GTM-PZ8SVN4N';
const REACT_APP_GA4_TRACKING_ID = 'G-XCY52XCGDQ';
const REACT_APP_AMPLITUDE_API_KEY = '77aa4b85ff560f46f41515a95d4e06da';
const REACT_APP_AI_EVENT_URL_KO =
  'https://vf-ca-cloud.polarisoffice.com/ko/promotion/firstmonth_202311_app';
const REACT_APP_AI_EVENT_URL_EN =
  'https://vf-ca-cloud.polarisoffice.com/en/promotion/firstmonth_202311_app';

const REACT_APP_ALLI_APPS = JSON.stringify({
  AlliIconCandidate: {
    ko: 'TExNQXBwOjY2MTUwMmRjNzQ5YWM4MzBmNGRmNTBjYQ==',
    en: 'TExNQXBwOjY2MTUwNDUzNzQ5YWM4MzBmNGRmNTFjNw==',
    ja: 'TExNQXBwOjY2MGZjZGJmNTA4YTI3ZTI1Y2UwYWI2OQ=='
  },
  AlliIconCopyrighting: {
    ko: 'TExNQXBwOjY2MTUwMmRjNzQ5YWM4MzBmNGRmNGY0NQ==',
    en: 'TExNQXBwOjY2MTUwNDU0NzQ5YWM4MzBmNGRmNTVjMA==',
    ja: 'TExNQXBwOjY2MGZjZGJmNTA4YTI3ZTI1Y2UwYWExZA=='
  },
  AlliIconCrew: {
    ko: 'TExNQXBwOjY2MTUwMmRjNzQ5YWM4MzBmNGRmNTA1MQ==',
    en: 'TExNQXBwOjY2MTUwNDUzNzQ5YWM4MzBmNGRmNTM1Ng==',
    ja: 'TExNQXBwOjY2MGZjZGJmNTA4YTI3ZTI1Y2UwYWIwNQ=='
  },
  AlliIconEvent: {
    ko: 'TExNQXBwOjY2MTUwMmRkNzQ5YWM4MzBmNGRmNTEwNA==',
    en: 'TExNQXBwOjY2MTUwNDUzNzQ5YWM4MzBmNGRmNTM4Nw==',
    ja: 'TExNQXBwOjY2MGZjZGJmNTA4YTI3ZTI1Y2UwYWI5YQ=='
  },
  AlliIconLaw: {
    ko: 'TExNQXBwOjY2MTUwMmRjNzQ5YWM4MzBmNGRmNGRjYQ==',
    en: 'TExNQXBwOjY2MTUwNDUzNzQ5YWM4MzBmNGRmNTNlZA==',
    ja: 'TExNQXBwOjY2MGZjZGJlNTA4YTI3ZTI1Y2UwYThkOA=='
  },
  AlliIconManual: {
    ko: 'TExNQXBwOjY2MTUwMmRjNzQ5YWM4MzBmNGRmNGY3Zg==',
    en: 'TExNQXBwOjY2MTUwNDU0NzQ5YWM4MzBmNGRmNTU3OQ==',
    ja: 'TExNQXBwOjY2MGZjZGJmNTA4YTI3ZTI1Y2UwYWE0ZQ=='
  },
  AlliIconNoti: {
    ko: 'TExNQXBwOjY2MTUwMmRjNzQ5YWM4MzBmNGRmNGVmNQ==',
    en: 'TExNQXBwOjY2MTUwNDUzNzQ5YWM4MzBmNGRmNTI0MA==',
    ja: 'TExNQXBwOjY2MGZjZGJmNTA4YTI3ZTI1Y2UwYTlkNg=='
  },
  AlliIconPrivacy: {
    ko: 'TExNQXBwOjY2MTUwMmRjNzQ5YWM4MzBmNGRmNGQ5NA==',
    en: 'TExNQXBwOjY2MTUwNDU0NzQ5YWM4MzBmNGRmNTRjNQ==',
    ja: 'TExNQXBwOjY2MGZjZGJlNTA4YTI3ZTI1Y2UwYThhYg=='
  },
  AlliIconPromotion: {
    ko: 'TExNQXBwOjY2MTUwMmRkNzQ5YWM4MzBmNGRmNTEzYQ==',
    en: 'TExNQXBwOjY2MTUwNDUzNzQ5YWM4MzBmNGRmNTI2ZA==',
    ja: 'TExNQXBwOjY2MGZjZGJmNTA4YTI3ZTI1Y2UwYWJjNw=='
  },
  AlliIconPush: {
    ko: 'TExNQXBwOjY2MTUwMmRjNzQ5YWM4MzBmNGRmNGZjMQ==',
    en: 'TExNQXBwOjY2MTUwNDUzNzQ5YWM4MzBmNGRmNTJkOA==',
    ja: 'TExNQXBwOjY2MGZjZGJmNTA4YTI3ZTI1Y2UwYWE4Nw=='
  },
  AlliIconSentence: {
    ko: 'TExNQXBwOjY2MTUwMmRjNzQ5YWM4MzBmNGRmNGU1MQ==',
    en: 'TExNQXBwOjY2MTUwNDU0NzQ5YWM4MzBmNGRmNTQ5Yw==',
    ja: 'TExNQXBwOjY2MGZjZGJmNTA4YTI3ZTI1Y2UwYTk0NA=='
  },
  AlliIconTranslator: {
    ko: 'TExNQXBwOjY2MTUwMmRjNzQ5YWM4MzBmNGRmNGU5Mw==',
    en: 'TExNQXBwOjY2MTUwNDU0NzQ5YWM4MzBmNGRmNTUxYg==',
    ja: 'TExNQXBwOjY2MGZjZGJmNTA4YTI3ZTI1Y2UwYTk3ZA=='
  },
  AlliIconWelcome: {
    ko: 'TExNQXBwOjY2MTUwMmRjNzQ5YWM4MzBmNGRmNTAwOQ==',
    en: 'TExNQXBwOjY2MTUwNDUzNzQ5YWM4MzBmNGRmNTMxNw==',
    ja: 'TExNQXBwOjY2MGZjZGJmNTA4YTI3ZTI1Y2UwYWFjNg=='
  },
  AlliIconEmail: {
    ko: 'TExNQXBwOjY2MTUwMmQ5NzQ5YWM4MzBmNGRmNGFiOA==',
    en: 'TExNQXBwOjY2MTUwNDUzNzQ5YWM4MzBmNGRmNTNjMA==',
    ja: 'TExNQXBwOjY2MGZjZGJkNTA4YTI3ZTI1Y2UwYTY4Mw=='
  },
  AlliIconGoodWord: {
    ko: 'TExNQXBwOjY2MTUwMmRjNzQ5YWM4MzBmNGRmNGUxMQ==',
    en: 'TExNQXBwOjY2MTUwNDU0NzQ5YWM4MzBmNGRmNTU0OA==',
    ja: 'TExNQXBwOjY2MGZjZGJlNTA4YTI3ZTI1Y2UwYTkwZA=='
  },
  AlliIconSlideNote: {
    ko: 'TExNQXBwOjY2MDNhNjI0MmFmZTAxMGNmYzYzYmRkOA==',
    en: 'TExNQXBwOjY2NjdlODdkYjVmNjhkYmI5YTMyMzc5NA==',
    ja: 'TExNQXBwOjY2NjdlYTg3YmMzYWZjNzgzNmZmMjI4Nw=='
  }
});

module.exports = new Promise((resolve, reject) => {
  resolve({
    REACT_APP_USE_LOGGER_SPLUNK,
    REACT_APP_PO_API,
    GENERATE_SOURCEMAP,
    REACT_APP_USE_LOGGER_MODE_VF,
    REACT_APP_SHARE_TECH_API,
    REACT_APP_AI_EVENT_URL_KO,
    REACT_APP_AI_EVENT_URL_EN,
    REACT_APP_GTM_ID,
    REACT_APP_GA4_TRACKING_ID,
    REACT_APP_AMPLITUDE_API_KEY,
    REACT_APP_ALLI_APPS
  });
});
