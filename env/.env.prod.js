const REACT_APP_USE_LOGGER_SPLUNK = true;
const REACT_APP_USE_LOGGER_MODE_VF = false;
const GENERATE_SOURCEMAP = false;
const REACT_APP_SHARE_TECH_API = 'https://api.polarishare.com/api/v1/share/office/contents';
const REACT_APP_PO_API = '	https://polink-static-contents.polarisoffice.com';
const REACT_APP_GTM_ID = 'GTM-PGSXB6GL';
const REACT_APP_AI_EVENT_URL_KO = 'https://polarisoffice.com/ko/promotion/firstmonth_202311_app';
const REACT_APP_AI_EVENT_URL_EN = 'https://polarisoffice.com/en/promotion/firstmonth_202311_app';

module.exports = new Promise((resolve, reject) => {
  resolve({
    REACT_APP_USE_LOGGER_SPLUNK,
    REACT_APP_USE_LOGGER_MODE_VF,
    REACT_APP_PO_API,
    GENERATE_SOURCEMAP,
    REACT_APP_SHARE_TECH_API,
    REACT_APP_AI_EVENT_URL_KO,
    REACT_APP_AI_EVENT_URL_EN,
    REACT_APP_GTM_ID
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
