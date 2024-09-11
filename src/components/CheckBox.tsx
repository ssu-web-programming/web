import styled from 'styled-components';

import icon_check from '../img/ico_check.svg';
import { alignItemCenter, flex, justiCenter } from '../style/cssCommon';

export interface CheckBoxProps {
  isChecked: boolean;
  setIsChecked: (check: boolean) => void;
  onClick: (e: React.MouseEvent<HTMLDivElement>) => void;
}

const CheckBox = (props: CheckBoxProps) => {
  const { isChecked, onClick } = props;

  return (
    <Circle checked={isChecked} onClick={onClick}>
      {isChecked && <IconImg src={icon_check} />}
    </Circle>
  );
};

export default CheckBox;

const Circle = styled.div<{ checked: boolean }>`
  ${flex}
  ${justiCenter}
  ${alignItemCenter}

  width: 20px;
  min-width: 20px;
  height: 20px;
  margin-left: auto;
  background-color: ${(props) => (props.checked ? '#6f3ad0' : 'none')};
  border: ${(props) => (props.checked ? 'none' : '1px solid #c9cdd2')};
  border-radius: 20px;
`;

const IconImg = styled.img`
  width: 12px;
  height: 12px;
`;
