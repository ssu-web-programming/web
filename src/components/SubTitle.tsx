import styled from 'styled-components';
import { flex } from '../style/cssCommon';

const SubTitleWrapper = styled.div`
  ${flex}

  font-size: 13px;
  font-weight: 500;
`;

interface SubTitleProps {
  subTitle: string;
  children?: React.ReactNode;
}

const SubTitle = ({ subTitle, children }: SubTitleProps) => {
  return (
    <SubTitleWrapper>
      {subTitle}
      {children}
    </SubTitleWrapper>
  );
};

export default SubTitle;
