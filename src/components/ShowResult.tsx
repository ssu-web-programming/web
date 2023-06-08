import Icon from './Icon';
import icon_arrow_right from '../img/ico_arrow_right.png';
import { css } from 'styled-components';
import Button, { ButtonProps } from './Button';
import { TextBtnCss } from '../style/cssCommon';
import { useTranslation } from 'react-i18next';

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
      {t(`ShowResult`)}
      {/* 고해상도 icon 요청 필요 */}
      <Icon
        cssExt={css`
          margin-left: 5px;
        `}
        iconSrc={icon_arrow_right}
      />
    </Button>
  );
};

export default ShowResult;
