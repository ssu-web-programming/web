import Icon from './Icon';
import icon_arrow_right from '../img/ico_front.svg';
import styled, { css } from 'styled-components';
import Button, { ButtonProps } from './Button';
import { TextBtnCss, alignItemCenter, flex, justiCenter } from '../style/cssCommon';
import { useTranslation } from 'react-i18next';

const Contents = styled.div`
  ${flex}
  ${justiCenter}
  ${alignItemCenter}
  gap: 5px;
`;

const ShowResult = (props: ButtonProps) => {
  const { t } = useTranslation();

  return (
    <Button
      {...props}
      cssExt={css`
        font-size: 12px;
        font-weight: normal;
        font-stretch: normal;
        font-style: normal;
        line-height: normal;
        letter-spacing: normal;
        color: var(--gray-gray-80-02);

        ${TextBtnCss}

        ${props.cssExt}
      `}>
      <Contents>
        {t(`ShowResult`)}
        {/* 고해상도 icon 요청 필요 */}
        <Icon size="sm" iconSrc={icon_arrow_right} />
      </Contents>
    </Button>
  );
};

export default ShowResult;
