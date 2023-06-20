const REACT_APP_USE_LOGGER_SPLUNK = false;
const REACT_APP_SHARE_TECH_API = 'https://dev-was2.polarishare.com/api/v1/share/office/contents';

module.exports = new Promise((resolve, reject) => {
  resolve({ REACT_APP_USE_LOGGER_SPLUNK, REACT_APP_SHARE_TECH_API });
  // Promise.all([common_promise]).then((resultArr) => {
  //   const common = resultArr[0];
  //   resolve({
  //     ...common,
  //     BACK_END_SERVER_URL,
  //     REACT_APP_USING_COLLABORATION,
  //     REACT_APP_GA_UA_TRACKING_ID
  //   });
  // });
});
