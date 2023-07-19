import { ReactComponent as IconPrev } from '../img/ico_arrow_prev.svg';
import { ReactComponent as IconNext } from '../img/ico_arrow_next.svg';
import IconButton from './buttons/IconButton';
import { PropsWithChildren } from 'react';
import { ButtonProps } from './buttons/Button';
import { ReactElement } from 'react-markdown/lib/react-markdown';
import { IconSize } from './Icon';

type SwitcherType = 'index' | 'imgList';

const BUTTON_SIZE = {
  sm: {
    width: 32,
    height: 28
  },
  md: {
    width: 32,
    height: 32
  },
  lg: {
    width: 48,
    height: 48
  }
};

const IMG_LIST_SIZE = {
  sm: '60px',
  md: '80px',
  lg: '100px'
};

interface ArrowSwitcherProp extends Omit<ButtonProps, 'onClick' | 'width' | 'height'> {
  onPrev: ButtonProps['onClick'];
  onNext: ButtonProps['onClick'];
  listLength: number;
  curListIndex: number;
  type: SwitcherType;
  children?: ReactElement[];
  size: IconSize;
}

const ArrowSwitcher = (props: PropsWithChildren<ArrowSwitcherProp>) => {
  const { onPrev, onNext, listLength, curListIndex, children, size, type } = props;

  return (
    <>
      <IconButton
        width={BUTTON_SIZE[size].width}
        height={BUTTON_SIZE[size].height}
        disable={curListIndex === null || curListIndex <= 0}
        onClick={onPrev}
        iconSize={size}
        iconComponent={IconPrev}
      />
      {type === 'index' ? (
        <div>
          {curListIndex + 1}/{listLength}
        </div>
      ) : (
        children &&
        children.map((child) => (
          <div
            style={{
              width: IMG_LIST_SIZE[size],
              height: IMG_LIST_SIZE[size],
              cursor: 'pointer'
            }}>
            {child}
          </div>
        ))
      )}
      <IconButton
        width={BUTTON_SIZE[size].width}
        height={BUTTON_SIZE[size].height}
        disable={curListIndex === null || curListIndex >= listLength - 1}
        onClick={onNext}
        iconSize={size}
        iconComponent={IconNext}
      />
    </>
  );
};

export default ArrowSwitcher;
