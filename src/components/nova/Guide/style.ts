import styled, { FlattenSimpleInterpolation } from 'styled-components';

import { ReactComponent as IconConvert } from '../../../img/light/nova/tab/convert_Img.svg';

export const Container = styled.div`
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 16px;
  flex: 1 1 0;
  overflow-y: auto;
`;

export const GuideWrapper = styled.div`
  width: 100%;
  margin: auto;
`;

export const GuideImage = styled.img<{ $isChat: boolean }>`
  width: ${({ $isChat }) => ($isChat ? '60px' : '120px')};
  height: ${({ $isChat }) => ($isChat ? '60px' : '80px')};
  border-radius: 8px;
`;

export const GuideTitle = styled.div<{ $guideTitleStyle?: FlattenSimpleInterpolation }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  margin-bottom: 40px;

  div.title {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6.5px;
    font-size: 24px;
    font-weight: 700;
    line-height: 36px;
    color: ${({ theme }) => theme.color.text.highlight01};

    svg {
      width: 19px;
      height: 21px;
    }
  }

  p.desc {
    font-size: 16px;
    font-weight: 500;
    line-height: 24px;
    letter-spacing: -0.02em;
    color: ${({ theme }) => theme.color.text.gray03};
    text-align: center;
    white-space: break-spaces;
  }

  ${({ $guideTitleStyle }) => $guideTitleStyle && $guideTitleStyle}
`;
export const GuideBody = styled.div`
  width: 100%;
  height: 206px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 16px;
`;

export const StyledIconConvert = styled(IconConvert)`
  path {
    fill: ${({ theme }) => theme.color.text.main};
  }
`;
