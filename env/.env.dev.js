const REACT_APP_USE_LOGGER_SPLUNK = false;
const REACT_APP_SHARE_TECH_API = 'https://dev-was2.polarishare.com/api/v1/share/office/contents';
const REACT_APP_PO_API = 'https://vf-postatic.polarisoffice.com';
const REACT_APP_GTM_ID = 'GTM-PZ8SVN4N';
const REACT_APP_GA4_TRACKING_ID = 'G-XCY52XCGDQ';
const REACT_APP_AI_EVENT_URL_KO =
  'https://vf-ca-cloud.polarisoffice.com/ko/promotion/firstmonth_202311_app';
const REACT_APP_AI_EVENT_URL_EN =
  'https://vf-ca-cloud.polarisoffice.com/en/promotion/firstmonth_202311_app';

module.exports = new Promise((resolve, reject) => {
  resolve({
    REACT_APP_USE_LOGGER_SPLUNK,
    REACT_APP_PO_API,
    REACT_APP_SHARE_TECH_API,
    REACT_APP_AI_EVENT_URL_KO,
    REACT_APP_AI_EVENT_URL_EN,
    REACT_APP_GTM_ID,
    REACT_APP_GA4_TRACKING_ID
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
