import styled from 'styled-components';
import Wrapper from '../components/Wrapper';
import InputText from '../components/InputText';
import { useState } from 'react';
import Button from '../components/Button';
import Container from '../components/Container';
import { useTranslation } from 'react-i18next';

const Contents = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
`;

const Header = styled.div`
  height: 100px;
`;

const Body = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const Footer = styled.div`
  height: 100px;
`;

const InputItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px; ;
`;

const Title = styled.div`
  font-size: 20px;
`;

const Buttons = styled.div`
  display: flex;
  flex-direction: row;
  gap: 20px;
`;

const PAGE_COUNT_OPTION = [3, 5, 7, 10];
const IMAGE_STYLE_OPTION = ['현실적인', '일러스트', '예술적인'];

export default function Presentation() {
  const { t, ready } = useTranslation();
  const [subject, setSubject] = useState<string>('');
  const [pageCount, setPageCount] = useState<number>();
  const [imageStlye, setImageStyle] = useState<string>();

  return (
    <Wrapper>
      <Contents>
        <Header>header area</Header>
        <Body>
          <InputItem>
            <Title>주제 입력</Title>
            <InputText size={600} value={subject} onChange={setSubject}></InputText>
          </InputItem>
          <InputItem>
            <Title>{t('PageCount')}</Title>
            <Buttons>
              {PAGE_COUNT_OPTION.map((opt) => (
                <Button
                  key={opt}
                  width={150}
                  height={30}
                  selected={pageCount === opt}
                  onClick={() => setPageCount(opt)}>
                  {`${opt}장`}
                </Button>
              ))}
            </Buttons>
          </InputItem>
          <InputItem>
            <Title>생설될 이미지 스타일 선택</Title>
            <Buttons>
              {IMAGE_STYLE_OPTION.map((opt) => (
                <Button
                  key={opt}
                  width={150}
                  height={30}
                  selected={imageStlye === opt}
                  onClick={() => setImageStyle(opt)}>
                  {opt}
                </Button>
              ))}
            </Buttons>
          </InputItem>
          <InputItem>
            <Title>색상 톤 앤 매너 선택</Title>
          </InputItem>
        </Body>
        <Footer>
          <Container>
            <Button
              onClick={() =>
                alert(
                  `subject: ${JSON.stringify({
                    subject,
                    pageCount,
                    imageStlye
                  })}`
                )
              }>
              AI Presentation 만들기
            </Button>
          </Container>
        </Footer>
      </Contents>
    </Wrapper>
  );
}
