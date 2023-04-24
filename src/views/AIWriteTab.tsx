import styled from 'styled-components';
import SubTitle from '../components/SubTitle';
import TextArea from '../components/TextArea';
import { LengthWrapper, RowBox } from './AIChatTab';
import Button from '../components/Button';
import Icon from '../components/Icon';
import { useState } from 'react';
import OpenAILinkText from '../components/OpenAILinkText';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding: 20px;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
`;

const InputArea = styled.div`
  display: flex;
  flex-direction: column;
  margin: 10px 0px 10px;
  border: solid 1px black;
  padding: 10px;
`;

const TextButton = styled.div`
  display: flex;
  cursor: pointer;
`;

const ResultBox = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 100%;
  height: 50%;
  border: solid 1px black;
`;

const LoadingWrapper = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  justify-content: center;
  align-items: center;
`;

const ResultWrapper = styled.div`
  display: flex;
  overflow: auto;
  white-space: break-spaces;
`;

const TextInfo = styled.div`
  display: flex;
  margin-top: 10px;
`;

const formList = [
  { id: 'sentence', icon: '', title: '문장' },
  { id: 'list', icon: '', title: '목록' },
  { id: 'table', icon: '', title: '표' }
];

const lengthList = [
  { title: '300자', length: 300 },
  { title: '500자', length: 500 },
  { title: '800자', length: 800 },
  { title: '1000자', length: 1000 }
];

interface FormListType {
  id: string;
  icon?: string;
  title: string;
}

interface LengthListType {
  title: string;
  length: number;
}

const testResult = `곳으로 품었기 피어나는 간에 부패뿐이다. 그들의 피부가 그들의 교향악이다. 목숨을 너의 없으면 소금이라 황금시대의 것은 칼이다. 미묘한 우리는 피고, 관현악이며, 사막이다. 같으며, 많이 우리 황금시대를 방황하여도, 그들은 별과 것이다. 들어 청춘의 위하여서, 예가 철환하였는가? 심장의 인생에 가는 피고, 스며들어 그것은 운다. 찾아다녀도, 풀이 대고, 보라. 청춘의 이것을 하여도 아니다. 얼마나 광야에서 귀는 풀밭에 이상의 거친 심장은 없으면 봄바람이다.

트고, 뛰노는 품었기 봄날의 그것을 방황하였으며, 노년에게서 밝은 지혜는 황금시대다. 어디 얼마나 사랑의 용기가 뜨거운지라, 가지에 있는가? 이상의 갑 그것을 날카로우나 끓는다. 전인 행복스럽고 고동을 발휘하기 그리하였는가? 작고 것이다.보라, 가치를 인생의 웅대한 봄날의 이상의 피다. 인도하겠다는 피고, 놀이 얼음과 영원히 옷을 만물은 그들의 어디 때문이다. 생명을 인생에 싶이 것은 모래뿐일 그들의 두손을 때문이다. 주며, 황금시대의 영원히 것이다. 얼마나 용기가 우리의 노년에게서 우는 피고 못하다 듣는다. 우리의 공자는 인도하겠다는 품고 것이다.

모래뿐일 이성은 이것이야말로 하는 고동을 장식하는 있다. 만물은 넣는 이 기관과 같은 트고, 소리다.이것은 이것은 봄바람이다. 아니더면, 청춘 인생을 품었기 같은 피어나는 곳이 긴지라 열락의 피다. 스며들어 풀이 천하를 이성은 그러므로 이상은 풀밭에 대고, 날카로우나 봄바람이다. 아니더면, 용감하고 있는 있는 사막이다. 속에 구하지 그것은 사막이다. 이상 남는 보이는 싶이 곧 청춘 그러므로 소금이라 열락의 봄바람이다. 긴지라 풀이 우리 물방아 듣는다. 이것이야말로 않는 무엇을 목숨을 보라. 수 그것은 청춘 이것이다. 피어나는 있을 자신과 하는 칼이다.`;

const AIWriteTab = () => {
  const [subject, setSubject] = useState<string>('');
  const [selectedForm, setSelectedForm] = useState<FormListType | null>(null);
  const [selectedLength, setSelectedLength] = useState<LengthListType | null>(null);
  const [writeResult, setWriteResult] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isEndResult, setIsEndResult] = useState<boolean>(true);

  const checkValid = () => {
    return subject.length > 0 && selectedForm != null && selectedLength != null;
  };

  const submitSubject = () => {
    // API 통신
    // TODO: 크레딧 체크 -> fail시 isLading(false) && Toast 출력.
    // TODO: 크레딧 체크 통과 시 결과 set.

    // 임시 함수
    const startTimer = setTimeout(() => {
      setIsLoading(false);
      setIsEndResult(false);
      setWriteResult(testResult);
    }, 2000);

    const endTimer = setTimeout(() => {
      setIsEndResult(true);
    }, 3000);
    return () => {
      clearTimeout(startTimer);
      clearTimeout(endTimer);
    };
  };

  return (
    <Wrapper>
      {writeResult.length === 0 && !isLoading ? (
        <>
          <SubTitle subTitle="주제 작성하기" />
          <InputArea>
            <TextArea
              rows={5}
              value={subject}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setSubject(e.target.value);
              }}
            />
            <RowBox>
              <LengthWrapper>1000/10</LengthWrapper>
              <TextButton>예시 문구보기</TextButton>
            </RowBox>
          </InputArea>

          <SubTitle subTitle="형식" />
          <RowBox>
            {formList.map((form) => (
              <Button
                key={form.id}
                onClick={() => {
                  setSelectedForm(form);
                }}
                selected={selectedForm ? (selectedForm.id === form.id ? true : false) : false}>
                <Icon iconSrc={form.icon} />
                <div>{form.title}</div>
              </Button>
            ))}
          </RowBox>

          <SubTitle subTitle="글자 수" />
          <RowBox>
            {lengthList.map((length, index) => (
              <Button
                key={index}
                onClick={() => {
                  setSelectedLength(length);
                }}
                selected={
                  selectedLength ? (selectedLength.length === length.length ? true : false) : false
                }
                width={150}
                height={30}>
                {length.title}
              </Button>
            ))}
          </RowBox>

          <Button
            onClick={() => {
              if (checkValid()) {
                setIsLoading(true);
                submitSubject();
              }
            }}
            width={150}
            height={30}>
            작성하기
          </Button>
        </>
      ) : (
        <>
          <ResultBox>
            {isLoading && writeResult.length === 0 ? (
              <LoadingWrapper>로딩중...</LoadingWrapper>
            ) : (
              <ResultWrapper>{writeResult}</ResultWrapper>
            )}
            {!isLoading && writeResult.length > 0 && (
              <>
                {!isEndResult && (
                  <Button
                    onClick={() => {
                      // TODO: stop 로직
                      // TODO: Toast 출력
                    }}
                    width={50}
                    height={20}>
                    STOP
                  </Button>
                )}
                <RowBox>
                  <TextInfo>공백 포함 {writeResult.length}자</TextInfo>
                  <Button
                    onClick={() => {
                      // 복사 로직
                    }}
                    width={50}
                    height={20}>
                    복사
                  </Button>
                </RowBox>
              </>
            )}
          </ResultBox>
          {!isLoading && writeResult.length > 0 && isEndResult && (
            <>
              <RowBox>
                <Button
                  onClick={() => {
                    // TODO
                  }}>
                  다시 작성하기
                </Button>
                <Button
                  onClick={() => {
                    // TODO
                  }}>
                  문서에 삽입하기
                </Button>
              </RowBox>
              <Button
                onClick={() => {
                  // TODO: redux에 데이터 set -> Tools 컴포넌트 selectedTab 변경
                }}
                width={400}>
                채팅으로 더 많은 작업하기
              </Button>
              <OpenAILinkText />
            </>
          )}
        </>
      )}
    </Wrapper>
  );
};

export default AIWriteTab;
