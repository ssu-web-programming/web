import styled from 'styled-components';

import ico_clovax_primary from '../img/hyperClovaX_logotype_primary.svg';
import ico_navercloud from '../img/naver_cloud_ci_green.svg';
import { alignItemCenter, flex } from '../style/cssCommon';

import LinkText from './LinkText';

const Wrapper = styled.div`
  ${flex}

  vertical-align: middle;
  font-family: Pretendard;
  font-size: 11px;
  font-weight: 500;
  color: #8769ba;
  outline: none;
  margin-right: 3px;
  height: fit-content;
  width: fit-content;
  gap: 5px;
  ${alignItemCenter}
`;

const HCXLogo = styled.img`
  ${flex}
  align-self: center;
  height: 10px;
  width: 80px;

  margin-top: 1px;
`;

const NaverCloudLogo = styled(HCXLogo)`
  width: 80px;

  margin-top: 0px;
`;

const CLOVA_URL = 'https://clova.ai/hyperclova';

const ClovaXLinkText = () => {
  return (
    <LinkText url={CLOVA_URL}>
      <Wrapper>
        <p>Powered By</p>
        <HCXLogo src={ico_clovax_primary} alt="ClovaX" />
        <NaverCloudLogo src={ico_navercloud} alt="NaverCloud" />
      </Wrapper>
    </LinkText>
  );
};

export default ClovaXLinkText;
