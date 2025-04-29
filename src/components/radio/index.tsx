import * as React from 'react';
import styled from 'styled-components';

interface RadioProps {
  checked: boolean;
  onChange?: () => void;
  size?: number;
  className?: string;
}

const RadioContainer = styled.div<{ size: number; checked: boolean }>`
  width: ${({ size }) => `${size}px`};
  height: ${({ size }) => `${size}px`};
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  border: 1.5px solid
    ${({ checked, theme }) => (checked ? theme.color.border.purple02 : theme.color.text.gray02)};
  transition: all 0.2s ease;
  position: relative;
  cursor: pointer;

  &::after {
    content: '';
    position: absolute;
    width: ${({ size, checked }) => (checked ? `${size / 2}px` : '0')};
    height: ${({ size, checked }) => (checked ? `${size / 2}px` : '0')};
    border-radius: 50%;
    background-color: ${({ theme }) => theme.color.border.purple02};
    transition: all 0.2s ease;
    opacity: ${({ checked }) => (checked ? 1 : 0)};
  }
`;

/**
 * 이중 원 형태의 라디오 버튼 컴포넌트
 * @param {boolean} checked - 선택 여부
 * @param {function} onChange - 변경 시 호출할 함수
 * @param {number} size - 버튼 크기 (기본값: 16px)
 * @param {string} className - 추가 스타일링을 위한 클래스명
 */
function Radio({ checked, onChange, size = 16, className }: RadioProps) {
  return <RadioContainer size={size} checked={checked} onClick={onChange} className={className} />;
}

export default Radio;
