import { FlattenSimpleInterpolation } from 'styled-components';

import CheckDarkIcon from '../../img/dark/ico_check_circle.svg';
import CheckSqureDarkIcon from '../../img/dark/ico_check_squre.svg';
import CheckLightIcon from '../../img/light/ico_check_circle.svg';
import CheckSqureLightIcon from '../../img/light/ico_check_squre.svg';
import { themeInfoSelector } from '../../store/slices/theme';
import { useAppSelector } from '../../store/store';

import * as S from './style';

export interface CheckBoxProps {
  isChecked: boolean;
  isCircleBox?: boolean;
  setIsChecked?: (check: boolean) => void;
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
  cssExt?: FlattenSimpleInterpolation;
}

const CheckBox = ({ isChecked, isCircleBox = true, onClick, cssExt }: CheckBoxProps) => {
  const { isLightMode } = useAppSelector(themeInfoSelector);

  return (
    <S.Circle checked={isChecked} isCircle={isCircleBox} onClick={onClick} cssExt={cssExt}>
      {isChecked && (
        <img
          src={
            isCircleBox
              ? isLightMode
                ? CheckLightIcon
                : CheckDarkIcon
              : isLightMode
                ? CheckSqureLightIcon
                : CheckSqureDarkIcon
          }
        />
      )}
    </S.Circle>
  );
};

export default CheckBox;
