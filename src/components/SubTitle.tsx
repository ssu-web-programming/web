import styled from 'styled-components';

const SubTitleWrapper = styled.div`
  display: flex;

  font-size: 13px;
  font-weight: 500;
  line-height: 1.54;
  color: var(--gray-gray-90-01);
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
