import styled from 'styled-components';

export const LogoWrap = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 3px;
  margin-bottom: 12px;

  .logo {
    height: 16px;
  }

  .normal {
    color: ${({ theme }) => theme.color.text.gray07};
    font-size: 12px;
    font-weight: 400;
  }

  .bold {
    color: ${({ theme }) => theme.color.text.gray07};
    font-size: 12px;
    font-weight: 700;
  }
`;
