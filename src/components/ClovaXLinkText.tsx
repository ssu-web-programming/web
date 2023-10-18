import { useTranslation } from 'react-i18next';
import LinkText from './LinkText';
import { alignItemCenter, flex, justiCenter } from '../style/cssCommon';
import styled from 'styled-components';
import ico_clovax_primary from '../img/HyperCLOVA X_Logotype_Primary.png';

const Wrapper = styled.div`
  ${flex}
  ${justiCenter}
  ${alignItemCenter}

  font-family: Pretendard;
  font-size: 11px;
  font-weight: 500;
  color: #8769ba;
  outline: none;
  margin-right: 3px;
  height: fit-content;
  width: fit-content;
  gap: 3px;
`;

const ClovaxLogo = styled.img`
  ${flex}
  align-self: center;
  height: 11px;
`;

const ClovaXLinkText = () => {
  const { t } = useTranslation();
  return (
    <LinkText url={t(`MoveToLimitInfo`)}>
      <Wrapper>Powered By</Wrapper>
      <ClovaxLogo src={ico_clovax_primary} alt="ClovaX" />
    </LinkText>
  );
};

export default ClovaXLinkText;
