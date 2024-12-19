import styled, { FlattenSimpleInterpolation } from 'styled-components';

import CheckDarkIcon from '../img/dark/ico_check_circle.svg';
import CheckLightIcon from '../img/light/ico_check_circle.svg';
import { themeInfoSelector } from '../store/slices/theme';
import { useAppSelector } from '../store/store';

export interface CheckBoxProps {
  isChecked: boolean;
  setIsChecked?: (check: boolean) => void;
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
  cssExt?: FlattenSimpleInterpolation;
}

const CheckBox = ({ isChecked, onClick, cssExt }: CheckBoxProps) => {
  const { isLightMode } = useAppSelector(themeInfoSelector);

  return (
    <Circle checked={isChecked} onClick={onClick} cssExt={cssExt}>
      {isChecked && <img src={isLightMode ? CheckLightIcon : CheckDarkIcon} />}
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
  border: ${(props) => (props.checked ? 'none' : '1px solid #c9cdd2')};
  border-radius: 20px;

  ${(props) => props.cssExt || ''};
`;
