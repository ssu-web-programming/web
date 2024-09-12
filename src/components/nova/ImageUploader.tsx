import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

import CreditIcon from '../../img/ico_credit_gray.svg';
import UploadIcon from '../../img/nova/upload_img.png';

const Wrap = styled.div`
  height: 206px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 0 16px;
  margin: 0 16px;
  border: 1px dashed #c9cdd2;
  border-radius: 8px;
  background-color: white;
  cursor: pointer;
`;

const Icon = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  img {
    width: 48px;
    height: 48px;
  }

  span {
    font-size: 16px;
    font-weight: 700;
    line-height: 24px;
    color: #454c53;
  }
`;

const Credit = styled.div`
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  padding: 2px 2px 2px 12px;
  background: #f2f4f6;
  border-radius: 999px;

  .img {
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  span {
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
    font-weight: 700;
    padding-bottom: 2px;
    color: #454c53;
  }
`;

const Guide = styled.div`
  font-size: 14px;
  font-weight: 400;
  line-height: 21px;
  color: #9ea4aa;
  white-space: break-spaces;
  text-align: center;
`;

interface ImageUploaderProps {
  guideMsg: string;
}

export default function ImageUploader(props: ImageUploaderProps) {
  const { t } = useTranslation();

  return (
    <Wrap>
      <Icon>
        <img src={UploadIcon} alt="upload" />
        <span>{t(`Nova.UploadTooltip.UploadImage`)}</span>
      </Icon>
      <Credit>
        <span>10</span>
        <div className="img">
          <img src={CreditIcon} alt="credit" />
        </div>
      </Credit>
      <Guide>{props.guideMsg}</Guide>
    </Wrap>
  );
}
