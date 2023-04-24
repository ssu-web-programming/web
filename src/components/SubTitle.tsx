import styled from 'styled-components';

const SubTitleWrapper = styled.div`
  display: flex;

  font-weight: bold;
  font-size: larger;
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
