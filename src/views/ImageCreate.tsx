import ExTextbox from '../components/ExTextbox';
import { useState } from 'react';

const exampleList = [
  '노을진 바다 위 비행기',
  '19세기 뉴욕 거리를 달리는 호랑이',
  '레오나르도 다빈치가 그린 해변에 있는 팬더',
  '로봇들만 있는 도시가 된 뉴욕,사이버펑크,현실적,4K,HQ',
  '모나리자 초상화 컨셉의 강아지',
  '하우스, 컨셉아트, 매트페인팅, HQ, 4k',
  '한강에서 새해 충사 행사의 모습, 불꽃놀이, 드론 쇼, 초현실적, 8k 높은 디테일',
  '만화 컨셉의 해리포터 포스터, 4K, HQ'
];

const ImageCreate = () => {
  const [descInput, setDescInput] = useState<string>('');

  return (
    <>
      <ExTextbox
        exampleList={exampleList}
        maxtTextLen={1000}
        subTitle="이미지 설명 작성하기"
        value={descInput}
        setValue={setDescInput}
      />
    </>
  );
};

export default ImageCreate;
