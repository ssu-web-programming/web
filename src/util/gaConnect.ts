import ReactGA from 'react-ga4';

function init() {
  const g_id = process.env.REACT_APP_GA4_TRACKING_ID as string;
  ReactGA.initialize(g_id);
}

//Event Function Overloading
const preEvent = ReactGA.event;
ReactGA.event = (payload) => {
  // const newEvent = { ...payload, category: payload.action, action: payload.category };
  preEvent(payload);
};

const preSend = ReactGA.send;
ReactGA.send = (payload) => {
  preSend(payload);
};

export default ReactGA;
export { init };
