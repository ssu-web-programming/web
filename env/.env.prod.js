const REACT_APP_USE_LOGGER_SPLUNK = true;
const REACT_APP_USE_LOGGER_MODE_VF = false;

module.exports = new Promise((resolve, reject) => {
  resolve({ REACT_APP_USE_LOGGER_SPLUNK, REACT_APP_USE_LOGGER_MODE_VF });
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
