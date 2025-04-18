import styled from 'styled-components';

export const GuideMessageContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

export const GuideMessage = styled.div`
  font-size: 14px;
  font-weight: 400;
  line-height: 21px;
  text-align: center;
  color: ${({ theme }) => theme.color.text.gray04};
`;

export const AvatarName = styled.div`
  font-size: 16px;
  font-weight: 700;
  line-height: 24px;
  color: ${({ theme }) => theme.color.text.gray03};
  margin-bottom: 4px;
`;

export const AvatarDetails = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

export const FlagPlaceholder = styled.div`
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background-color: ${({ theme }) => theme.color.background.gray06};
`;

export const AvatarDetail = styled.span`
  font-size: 12px;
  font-weight: 500;
  line-height: 18px;
  color: ${({ theme }) => theme.color.text.gray04};
`;

export const Divider = styled.span`
  font-size: 12px;
  font-weight: 500;
  line-height: 18px;
  color: ${({ theme }) => theme.color.text.gray05};
`;
