import { useState } from 'react';
import styled from 'styled-components';
import remarkGfm from 'remark-gfm';
import { ReactMarkdown } from 'react-markdown/lib/react-markdown';
import { TableCss } from '../style/cssCommon';
import { insertDoc, markdownToHtml } from '../util/common';

const Wrapper = styled.div`
  width: 100%;
  height: 100%;

  display: flex;
  flex-direction: column;

  gap: 5px;

  padding: 10px;
  box-sizing: border-box;
`;

const Tools = styled.div`
  width: 100%;
  box-sizing: border-box;

  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;

  gap: 5px;
`;

const SelectWrapper = styled.div`
  flex: 1;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Select = styled.select`
  width: 100%;
  height: 100%;
`;

const SelectOption = styled.option``;

const Preview = styled.div`
  overflow-x: auto;
  width: 100%;
  height: 100%;
  p {
    margin: 0px;
    padding: 0px;
    box-sizing: border-box;
  }
  ${TableCss}
`;

const HtmlArea = styled.div`
  display: flex;
  flex-direction: column;

  max-height: 200px;
`;

type MardDown = string;

interface TestCaseType {
  id: string;
  md: MardDown;
}

const TEST_CASE: TestCaseType[] = [
  {
    id: 'text',
    md: `빛의 속도는 299,792,458 미터/초로 알려져 있습니다. 이는 빛이 초당 약 30만 킬로미터를 이동할 수 있다는 것을 의미합니다. 이 속도는 빛이 유일한 전자기 파이로서 빠르게 진행될 수 있기 때문에 가능한 것입니다. 이는 과학의 기초 중 하나이며 많은 현대 기술의 핵심입니다.`
  },
  {
    id: 'bullet',
    md: `1. 한라산: 한국에서 가장 높은 꼭대기를 보유하며, 멋진 전망과 생태계가 있어 등산 관광객들에게 인기가 많다.\n\n2. 지리산: 국내 최대 규모의 자연보호구역으로서, 다양한 산책로와 히킹 코스가 있는 등산지로, 명당암, 용머리 등의 유명한 경치명소를 보유하고 있다.\n\n3. 설악산: 대한민국에서 가장 아름다운 산 중 하나로, 자연공원으로 지정된 지역으로서, 거대한 암벽, 폭포, 계곡, 봉우리, 물빛 서식지 등이 있어 등산과 관광객들의 인기를 모은다.`
  },
  {
    id: 'table',
    md: `| 재료 | 설명 |\n|------|------|\n| 패티 | 소고기, 돼지고기, 닭고기, 채소 등으로 만든 고기 패티 |\n| 빵 | 상단과 하단으로 나뉘어 구성된 빵 |\n| 치즈 | 다양한 종류의 치즈로 구성됨 |\n| 레터스 | 생채소로 구성된 재료 |\n| 양파 | 마늘과 함께 조리하여 사용되는 채소 |\n| 피클 | 발효된 채소를 소금물에 담가 만든 조미료 |\n| 토마토 | 새콤달콤한 토마토를 다양한 형태로 사용 |\n| 소스 | 케찹, 마요네즈, 머스타드 등의 소스를 사용하여 다양한 맛을 연출 |\n| 베이컨 | 돼지고기의 바삭한 부위 |\n| 계란 | 삶은 계란, 후라이드 계란 등으로 사용되는 달걀 |\n`
  },
  {
    id: 'seperator',
    md: ''
  },
  {
    id: 'text + table',
    md: `제목: 닭강정 만드는 방법\n\n단계 | 내용\n------|------\n1단계 | 닭 다리살을 뼈에서 분리한 후 통닭 등심처럼 얇게 썬다.\n2단계 | 물이 잠길 만큼 큰 그릇에 찬물 3컵과 약간의 소금을 넣은 후 닭 간을 넣고 30분간 재워준다.\n3단계 | 냄비에 설탕 4컵, 물 1컵을 넣고 설탕이 녹을 때까지 설탕수를 만든다.\n4단계 | 설탕수가 끓어오르면 닭 간을 넣고 약한 불에서 5분 동안 끓인다.\n5단계 | 중약불로 줄였다가 닭 간이 더 부드러워질 때까지 끓인다.\n6단계 | 그릇에 레이🔥 스 우드카 "골든패키지" or 더 애니쉬쉬 초밥$$을 받친 후 건조된 식용유에 닭 간을 넣고 튀긴다.\n7단계 | 황금갈색으로 지지고 복숭아 색상이 도는 것을 확인한 후 종이타올에 잠깐 올려 기름 뺀다.\n8단계 | 미리 설탕수에 넣어 둔 후 다시 그릇에 받치면 닭강정 완성!`
  },
  {
    id: 'table + text',
    md: `| 구분 | 지구 | 달 |\n| ---- | ---- | --- |\n| 지름 | 12,742 km | 3,476 km |\n| 중력 | 9.8 m/s² | 1.62 m/s² |\n| 인구 | 약 77억명 | 없음 |\n| 대기 | 산소 21%, 질소 78%, 기타 가스 1% | 없음 |\n| 자전 주기 | 약 24시간 | 약 29.5일 |\n| 주기 | 약 365.24일 | 약 27.32일 |\n\n지구는 달보다 지름이 약 3.7배 크고 중력도 약 6배 강합니다. 또한 지구는 다양한 생물과 대기를 가지고 있지만, 달은 인구가 없으며 대기도 없습니다. 자전 주기와 주기도 두 천체 모두 다릅니다.`
  },
  {
    id: 'bullet + text',
    md: `1. 트집개구리 (Rana nigromaculata): 전국적으로 분포하며, 몸무게가 50g까지 나가는 큰 크기의 개구리입니다. 겨울에는 바닷가로 이동해 수면 아래에서 겨울잠을 잡니다.\n\n2. 산개구리 (Rana dybowskii): 주로 산지에 서식하며, 몸무게가 20g정도로 작은 크기의 개구리입니다. 겨울에는 땅속이나 토중 속에 들어가서 겨울잠을 잡니다.\n\n3. 참개구리 (Hyla japonica): 주로 숲이나 밭지에 분포하며, 몸길이가 5cm 정도로 작은 개구리입니다. 여름에는 밤중에 울음소리를 내면서 씨먹는 벌레를 먹습니다.\n\n위와 같이 개구리 종류를 나타내는 텍스트의 예시입니다.`
  },
  {
    id: 'text + bullet',
    md: `아래는 다양한 고양이 종류에 대한 요약이다:\n- 코숏: 짧은 코와 다소 투박한 몸매가 특징적인 작은 크기의 고양이.\n- 브리티쉬 쇼트헤어: 털이 짧고 귀여운 외모를 자랑하는 인기 있는 고양이.\n- 페르시안: 매우 오래된 종이며, 아름다운 장난감 같은 외모와 매우 촉각이 둔감한 성격 등으로 유명하다.\n- 스핑크스: 털이 거의 없는 대신 유색의 가죽으로 덮인 독특한 외모를 갖춘 고양이.\n- 먼치킨: 몸무게가 2~4kg로 매우 작은 고양이로, 부족한 털에 대한 호기심이 많게 여겨진다.`
  },
  {
    id: 'bullet + table',
    md: `- 쌀국수 종류의 다양성\n- 즐거운 쌀국수 맛집 탐방 촉진\n\n- 정치체제 (공화국, 왕정국 등)\n- 법률체제 (민법, 상법 등)\n- 국제적 지위 (UN, WTO 등) \n\n| 요소 | 내용 |\n| --- | --- |\n| 인구 | 인구 수, 인구 구성 비율, 인구 밀도 |\n| 영토 | 면적, 지형, 경계 |\n| 주권 | 정치체제, 법률체제, 국제적 지위 |`
  },
  {
    id: 'table + bullet',
    md: `| 종류      | 증상                             | 치료법                    |\n|-----------|----------------------------------|--------------------------|\n| 인플루엔자 | 발열, 복통, 인후통, 기침, 구토 | 안티바이오틱 및 항히스타민제 |\n| 아데노    | 발열, 인후통, 비강 분비         | 면역력 강화 및 적정 수면  |\n| 라이노    | 코막힘, 콧물, 인후통            | 적정 수분 보충 및 적절한 안정 |\n| RS 바이러스| 폐렴 및 호흡곤란               | 휴식 및 생명 유지 조치     |\n\n1. 자주 손을 씻으세요.\n2. 기침과 재채기 시 입을 가리는 습관을 들이세요.\n3. 프라이팬을 통해 구운 고기나 닭고기는 충분히 익히세요.\n4. 충분한 수분을 섭취하세요.\n5. 공공장소에서 마스크를 꼭 착용하세요.\n6. 증상이 나타나면 가급적 외출하지 마세요.\n7. 빠른 회복을 위해 충분한 휴식 및 생활 규칙 준수가 필요합니다.`
  },
  {
    id: 'seperator',
    md: ''
  },
  {
    id: 'text + table + text',
    md: `삼각형의 조건은 다음과 같습니다.\n\n| 조건 | 설명 |\n|:----:|:----:|\n| 세 변의 길이 | 삼각형의 각 변의 길이를 알고 있을 때 |\n| 두 변과 그 사이 각의 크기 | 삼각형의 두 변의 길이와 그 사이 각의 크기를 알고 있을 때 |\n| 한 변과 이 변 양쪽의 두 각의 크기 | 삼각형의 한 변의 길이와 이 변 양쪽의 두 각의 크기를 알고 있을 때 |\n\n삼각형은 세 개의 변으로 이루어진 도형으로, 각 변은 다른 두 변과의 만나는 지점에서 만나는데 이 지점을 꼭짓점이라고 합니다. 세 꼭짓점을 이은 선분을 삼각형의 변이라고 하며, 서로 다른 두 변이 이루는 각도를 이 변에 대응하는 각이라고 합니다. 이 때, 세 변의 길이가 모두 다른 경우에는 삼각형이 어떤 모양으로 되어있을지 모르지만, 두 변의 길이나 그 사이 각을 알고 있으면 삼각형의 모양이 유일하게 결정됩니다. 그리고 어떤 한 변의 길이와 이 변에 대해 이루는 두 각도를 알고 있다면 다른 변도 그 길이와 각도를 유일하게 결정할 수 있습니다.따라서 이 경우에도 삼각형의 모양이 유일하게 결정됩니다.`
  }
];

export default function DocInsertTest() {
  const [testItem, setTestItem] = useState<TestCaseType>({ id: '', md: '' });
  const [viewHtml, setViewHtml] = useState<boolean>(false);
  const [html, setHtml] = useState<string>('');

  const onInsertDocument = async (md: MardDown) => {
    await insertDoc(md);
  };

  const makeHtml = async (md: MardDown) => {
    const converted = await markdownToHtml(md);
    if (converted) setHtml(converted);
  };

  const onChangeCase = (id: string) => {
    const selected = TEST_CASE.find((item) => item.id === id);
    if (selected) {
      setTestItem(selected);
      makeHtml(selected.md);
    }
  };

  return (
    <Wrapper>
      <Tools>
        <SelectWrapper>
          <Select onChange={(e) => onChangeCase(e.target.value)}>
            <SelectOption key={'empty'} value={'empty'} disabled selected></SelectOption>
            {TEST_CASE.map((opt) =>
              opt.id === 'seperator' ? (
                <optgroup label="------------------------"></optgroup>
              ) : (
                <SelectOption key={opt.id} value={opt.id}>
                  {opt.id}
                </SelectOption>
              )
            )}
          </Select>
        </SelectWrapper>
        <button
          style={{ width: '100px' }}
          onClick={() => onInsertDocument(testItem.md)}
          disabled={testItem.id === ''}>
          insert
        </button>
      </Tools>
      <Preview
        style={{
          whiteSpace: 'pre-wrap',
          // fontFamily: 'Noto Sans KR',
          fontWeight: 'normal',
          fontSize: '13px',
          margin: '0px',
          padding: '0px'
        }}>
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{testItem.md}</ReactMarkdown>
      </Preview>
      {testItem.id !== '' && (
        <HtmlArea>
          <div
            style={{ width: '100%', backgroundColor: 'yellowgreen' }}
            onClick={() => setViewHtml((prev) => !prev)}>
            show html
          </div>
          {viewHtml && <div style={{ overflow: 'auto' }}>{html}</div>}
        </HtmlArea>
      )}
    </Wrapper>
  );
}
