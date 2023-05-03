import styled from 'styled-components';

export const TextButton = styled.div`
  display: flex;
  cursor: pointer;
`;

interface ExButtonProps {
  exampleList: string[];
  setExam: Function;
}

const ExButton = ({ exampleList, setExam }: ExButtonProps) => {
  return (
    <TextButton
      onClick={() => {
        setExam(exampleList[Math.floor(Math.random() * exampleList.length)]);
      }}>
      예시 문구보기
    </TextButton>
  );
};

export default ExButton;
