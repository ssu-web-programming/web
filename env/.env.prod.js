const REACT_APP_USE_LOGGER_SPLUNK = true;
const REACT_APP_USE_LOGGER_MODE_VF = false;
const GENERATE_SOURCEMAP = false;
const REACT_APP_SHARE_TECH_API = 'https://api.polarishare.com/api/v1/share/office/contents';
const REACT_APP_PO_API = '	https://polink-static-contents.polarisoffice.com';
const REACT_APP_GTM_ID = 'GTM-PGSXB6GL';
const REACT_APP_GA4_TRACKING_ID = 'G-0C5M4VGQVE';
const REACT_APP_AMPLITUDE_API_KEY = '36797087f29a87d11cf8a7451befab2b';
const REACT_APP_AI_EVENT_URL_KO = 'https://polarisoffice.com/ko/promotion/firstmonth_202311_app';
const REACT_APP_AI_EVENT_URL_EN = 'https://polarisoffice.com/en/promotion/firstmonth_202311_app';

const REACT_APP_ALLI_APPS = JSON.stringify({
  AlliIconCandidate: {
    ko: 'TExNQXBwOjY1YWE1NGFlOTU1MGU3YmU1ZmY4NTM1ZA==',
    en: 'TExNQXBwOjY1Y2VmMWIzNDcwOWJhMDY5NzlhMGUyZg==',
    ja: 'TExNQXBwOjY2MTc3YjM1NzU3MmNhNDlkZTM4ODRkMA=='
  },
  AlliIconCopyrighting: {
    ko: 'TExNQXBwOjY1YWE1NWJlZWZlZGI3ODEyNjI1YWZjMA==',
    en: 'TExNQXBwOjY1Y2VmNGYzZjlhMmVlMTE4ZDg3OTZmMA==',
    ja: 'TExNQXBwOjY2MTc3YjM0NzU3MmNhNDlkZTM4ODM1ZA=='
  },
  AlliIconCrew: {
    ko: 'TExNQXBwOjY1YWE1NGNjN2M0ZWFhNDJlZmNjMTRlZg==',
    en: 'TExNQXBwOjY1Y2VmMmM4MTIxMGQ2MzRlODNhMzBjZg==',
    ja: 'TExNQXBwOjY2MTc3YjM0NzU3MmNhNDlkZTM4ODJhNA=='
  },
  AlliIconEvent: {
    ko: 'TExNQXBwOjY1YWE1NjYzZGY3ZDA0OTlkNGM2N2EzZg==',
    en: 'TExNQXBwOjY1Y2VmOGIxNDcwOWJhMDY5NzlmNGE3ZA==',
    ja: 'TExNQXBwOjY2MTc3YjM0NzU3MmNhNDlkZTM4ODI2Mw=='
  },
  AlliIconLaw: {
    ko: 'TExNQXBwOjY1NjU0MzdmM2YxNGI4ZjE4MjhhNTJmNA==',
    en: 'TExNQXBwOjY1Y2VlZjA0YWRlYWY3NWMxZmIyYWI2ZQ==',
    ja: 'TExNQXBwOjY2MTc3YjM1NzU3MmNhNDlkZTM4ODQ5Nw=='
  },
  AlliIconManual: {
    ko: 'TExNQXBwOjY1ODNkN2ZlYmI0NmNkYzM1ZTYwMWQxMg==',
    en: 'TExNQXBwOjY1Y2VmZDA2ZjlhMmVlMTE4ZDhiMTljMw==',
    ja: 'TExNQXBwOjY2MTc3YjM1NzU3MmNhNDlkZTM4ODQ2OA=='
  },
  AlliIconNoti: {
    ko: 'TExNQXBwOjY1YWE1NGMxYWM0ZjdlYTdjMWE0NTUxZA==',
    en: 'TExNQXBwOjY1Y2VmNTljMDdlZGU1MWM2YmYxNzEyMA==',
    ja: 'TExNQXBwOjY2MTc3YjM1NzU3MmNhNDlkZTM4ODU5Yg=='
  },
  AlliIconPrivacy: {
    ko: 'TExNQXBwOjY1YWE1NDA1ZWM2N2Q2NGEzOTlmNTJlOA==',
    en: 'TExNQXBwOjY1Y2VlZmU2ZmI5MDBjZDczYWZlYWIzZQ==',
    ja: 'TExNQXBwOjY2MTc3YjM0NzU3MmNhNDlkZTM4ODQzNQ=='
  },
  AlliIconPromotion: {
    ko: 'TExNQXBwOjY1YWE1NGVhNTE0YzlhNTAzMGZjODg5NA==',
    en: 'TExNQXBwOjY1Y2VmNzAyZTljYzBlZTJiNTBlMTBkNw==',
    ja: 'TExNQXBwOjY2MTc3YjM0NzU3MmNhNDlkZTM4ODMxNA=='
  },
  AlliIconPush: {
    ko: 'TExNQXBwOjY1YWE1NTlhYzM4NTBlZWZkZjM1MmQ0Ng==',
    en: 'TExNQXBwOjY1Y2VmOTQxZDg2OTk2MThjY2RjYTAzOA==',
    ja: 'TExNQXBwOjY2MTc3YjM0NzU3MmNhNDlkZTM4ODM5OA=='
  },
  AlliIconSentence: {
    ko: 'TExNQXBwOjY1ODNmMmYyZWU1ZGIzMjdhOWU1NjYzYw==',
    en: 'TExNQXBwOjY1Y2VmMGQ0OWZlNzQ0NjdjZDJjNmU1Mg==',
    ja: 'TExNQXBwOjY2MTc3YjM1NzU3MmNhNDlkZTM4ODU0MA=='
  },
  AlliIconTranslator: {
    ko: 'TExNQXBwOjY1YWE1NTgzZDI5YWRhYWEzOTc5N2IxMg==',
    en: 'TExNQXBwOjY1Y2VmODUxZDgwZGNhZTMwMDZhYjM3ZA==',
    ja: 'TExNQXBwOjY2MTc3YjM1NzU3MmNhNDlkZTM4ODUwOQ=='
  },
  AlliIconWelcome: {
    ko: 'TExNQXBwOjY1YWE1NThlZDI5YWRhYWEzOTc5ODVjNQ==',
    en: 'TExNQXBwOjY1Y2VmMzNmZDg2OTk2MThjY2Q5ZmE0NQ==',
    ja: 'TExNQXBwOjY2MTc3YjM0NzU3MmNhNDlkZTM4ODJlNQ=='
  },
  AlliIconEmail: {
    ko: 'TExNQXBwOjY1YWE1NTc0ZDI3ZDNlMjcwNjI2ZDQ1MQ==',
    en: 'TExNQXBwOjY1Y2VlZWEzNDEzYTE5ZjcwOTdlMWFiYQ==',
    ja: 'TExNQXBwOjY2MTc3YjM0NzU3MmNhNDlkZTM4ODNkMw=='
  },
  AlliIconGoodWord: {
    ko: 'TExNQXBwOjY1ZTkyODliOWJkMDVkZWQyZTI5MWRmMg==',
    en: 'TExNQXBwOjY1ZTkyOTllZTk5YzMyNjI4MDljOTY1YQ==',
    ja: 'TExNQXBwOjY2MTc3YjM0NzU3MmNhNDlkZTM4ODQwYQ=='
  },
  AlliIconSlideNote: {
    ko: 'TExNQXBwOjY2NjdlNjMwMjRiZDU3ZDc4ODA1OThmNA==',
    en: 'TExNQXBwOjY2NjdlOGZlNWNmNDg4MjA4NzJiMmRhMw==',
    ja: 'TExNQXBwOjY2NjdlYWUzNjU1NjMyN2JmMjM1MzNhNA=='
  }
});

module.exports = new Promise((resolve, reject) => {
  resolve({
    REACT_APP_USE_LOGGER_SPLUNK,
    REACT_APP_USE_LOGGER_MODE_VF,
    REACT_APP_PO_API,
    GENERATE_SOURCEMAP,
    REACT_APP_SHARE_TECH_API,
    REACT_APP_AI_EVENT_URL_KO,
    REACT_APP_AI_EVENT_URL_EN,
    REACT_APP_GTM_ID,
    REACT_APP_GA4_TRACKING_ID,
    REACT_APP_AMPLITUDE_API_KEY,
    REACT_APP_ALLI_APPS
  });
  // Promise.all([common_promise]).then((resultArr) => {
  //   const common = resultArr[0];
  //   resolve({
  //     ...common,
  //     BACK_END_SERVER_URL,
  //     REACT_APP_USING_COLLABORATION,
  //     REACT_APP_GA_UA_TRACKING_ID,
  //     REACT_APP_GTM_ID,
  //   });
  // });
});
