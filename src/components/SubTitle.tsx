import styled from 'styled-components';

const SubTitleWrapper = styled.div`
  display: flex;
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
