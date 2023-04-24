import styled from 'styled-components';
import SubTitle from '../components/SubTitle';
import TextArea from '../components/TextArea';
import { LengthWrapper, RowBox } from './AIChatTab';
import Button from '../components/Button';
import Icon from '../components/Icon';
import { useRef, useState } from 'react';
import OpenAILinkText from '../components/OpenAILinkText';
import LinkText from '../components/LinkText';

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

const subjectMaxLength = 1000;
const exampleSubject = [
  '건강한 생활습관을 위한 효과적인 5가지 방법',
  '배달 서비스 마케팅 아이디어를 브레인스토밍하고 각 아이디어가 지닌 장점 설명',
  '비 오는 바다 주제의 소설 시놉시스',
  '중고 의류 쇼핑몰 CEO 인터뷰 질문 목록 10가지',
  '부모님 생일 선물을 추천해줘',
  '문서 작성을 효율적으로 하는 방법'
];

const AIWriteTab = () => {
  const [subject, setSubject] = useState<string>('');
  const [selectedForm, setSelectedForm] = useState<FormListType | null>(null);
  const [selectedLength, setSelectedLength] = useState<LengthListType | null>(null);

  const [writeResult, setWriteResult] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false); // 로딩 true 일때 == valid check 할 때 ~ response 오기 전
  const [isEndResult, setIsEndResult] = useState<boolean>(true); // response result 스트리밍 끝났을 때

  const stopRef = useRef<boolean>(false); // response result 스트리밍 도중 stop 버튼 눌렀을 때

  const checkValid = () => {
    return subject.length > 0 && selectedForm != null && selectedLength != null;
  };

  const setTempResult = async () => {
    const res = await fetch('https://kittyhawk.polarisoffice.com/api/v2/chat/chatStream', {
      headers: { 'content-type': 'application/json' },
      //   responseType: 'stream',
      body: JSON.stringify({
        history: [
          {
            content: 'hello',
            role: 'system'
          },
          {
            content: '한국 관광명소 3가지만 알려줘',
            role: 'user'
          }
        ]
      }),
      method: 'POST'
    });
    const reader = res.body?.getReader();
    var enc = new TextDecoder('utf-8');

    if (reader) {
      setIsLoading(false);
      setIsEndResult(false);
    }

    while (reader) {
      // if (isFull) break;
      const { value, done } = await reader.read();

      if (done || stopRef.current) {
        // setProcessState(PROCESS_STATE.COMPLETE_GENERATE);
        setIsEndResult(true);
        break;
      }

      const decodeStr = enc.decode(value);

      setWriteResult((prev) => (prev += decodeStr));
    }
  };

  const submitSubject = async () => {
    // API 통신
    // TODO: 크레딧 체크 -> fail시 isLading(false) && Toast 출력.
    // TODO: 크레딧 체크 통과 시 결과 set.
    // 임시 함수
    setTempResult();
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
                if (e?.target?.value.length <= subjectMaxLength) setSubject(e.target.value);
              }}
            />
            <RowBox>
              <LengthWrapper>
                {subject.length}/{subjectMaxLength}
              </LengthWrapper>
              <TextButton
                onClick={() => {
                  setSubject(exampleSubject[Math.floor(Math.random() * exampleSubject.length)]);
                }}>
                예시 문구보기
              </TextButton>
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
          <RowBox>
            <SubTitle subTitle="내용 미리보기" />
            <LinkText url="">주제 다시 입력하기</LinkText>
          </RowBox>
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
                      stopRef.current = true;
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
