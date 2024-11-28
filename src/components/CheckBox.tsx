import styled, { FlattenSimpleInterpolation } from 'styled-components';

import icon_check from '../img/ico_check.svg';

export interface CheckBoxProps {
  isChecked: boolean;
  setIsChecked: (check: boolean) => void;
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
  cssExt?: FlattenSimpleInterpolation;
}

const CheckBox = (props: CheckBoxProps) => {
  const { isChecked, onClick, cssExt } = props;

  return (
    <Circle checked={isChecked} onClick={onClick} cssExt={cssExt}>
      {isChecked && <IconImg src={icon_check} />}
    </Circle>
  );
};

export default CheckBox;

const Circle = styled.div<{ checked: boolean; cssExt?: FlattenSimpleInterpolation }>`
  display: flex;
  justify-content: center;
  align-items: center;

  width: 20px;
  min-width: 20px;
  height: 20px;
  margin-left: auto;
  background-color: ${(props) => (props.checked ? '#6f3ad0' : 'none')};
  border: ${(props) => (props.checked ? 'none' : '1px solid #c9cdd2')};
  border-radius: 20px;

  ${(props) => props.cssExt || ''};
`;

const IconImg = styled.img`
  width: 12px;
  height: 12px;
`;
