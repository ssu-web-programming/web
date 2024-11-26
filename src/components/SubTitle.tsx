import styled from 'styled-components';

const SubTitleWrapper = styled.div`
  display: flex;
  flex-direction: column;

  font-size: 13px;
  font-weight: 500;
  line-height: 1.54;
  color: var(--gray-gray-80-02);
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
