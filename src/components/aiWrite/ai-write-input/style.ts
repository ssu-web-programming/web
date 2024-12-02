import styled from 'styled-components';

const WriteInputPage = styled.div`
  display: flex;
  flex-direction: column;
  padding: 16px;
  width: 100%;
  height: 100%;
  gap: 16px;
`;

const InputArea = styled.div`
  display: flex;

  width: 100%;
`;

const VersionInner = styled.div`
  display: flex;
  flex-direction: row;
`;

const NewMark = styled.div`
  width: 6px;
  height: 6px;
  border-radius: 50%;
  margin: 2px;
  background-color: #fb4949;
`;

const TitleInputSet = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export { InputArea, NewMark, TitleInputSet, VersionInner, WriteInputPage };
