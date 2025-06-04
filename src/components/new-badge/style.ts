import styled from 'styled-components';

export const BadgeWrap = styled.div`
  width: 20px;
  height: 20px;
  position: absolute;
  top: 5px;
  left: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  background-color: var(--sale);

  span {
    font-size: 12px;
    font-weight: bold;
    color: var(--white);
  }
`;
