import LinkText from './LinkText';

const OPEN_API_LINK =
  'https://polarisofficehelp.zendesk.com/hc/ko/sections/6735266225039-Polaris-Office-AI-Usage-policy';

const OpenAILinkText = () => {
  return <LinkText url={OPEN_API_LINK}>Powered By OpenAI</LinkText>;
};

export default OpenAILinkText;
