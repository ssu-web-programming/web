import { Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

import ChangeBGIcon from '../../../img/common/nova/imgSample/bg_change_sample.png';
import RemoveBGIcon from '../../../img/common/nova/imgSample/bg_delete_sample.png';
import Convert2DTo3DIcon from '../../../img/common/nova/imgSample/convert_2dto3d_smaple.gif';
import ExpandImgIcon from '../../../img/common/nova/imgSample/image_expand_sample.png';
import RemakeImgIcon from '../../../img/common/nova/imgSample/image_remake_sample.png';
import ChangeStyleIcon from '../../../img/common/nova/imgSample/image_style_sample.png';
import improveImgIcon from '../../../img/common/nova/imgSample/image_upscaling_sample.png';
import creditIcon from '../../../img/light/ico_credit_line.svg';
import AIVideoLightIcon from '../../../img/light/nova/aiVideo/ico_ai_video.svg';
import PerplexityLightIcon from '../../../img/light/nova/perplexity/ico_perplexity.svg';
import TranslationLightIcon from '../../../img/light/nova/translation/ico_translation.svg';
import VoiceDictationLightIcon from '../../../img/light/nova/voiceDictation/ico_voice_dictation.svg';
import Banner from '../banner';

import * as S from './style';

import 'swiper/css';
import 'swiper/css/pagination';

const AI_TOOLS = [
  { icon: PerplexityLightIcon, name: '웹 검색', alt: 'perplexity' },
  { icon: TranslationLightIcon, name: '번역', alt: 'translation' },
  { icon: VoiceDictationLightIcon, name: '음성 받아쓰기', alt: 'voice dictation' },
  { icon: AIVideoLightIcon, name: 'AI 비디오', alt: 'ai video' }
];

const AI_IMAGES = [
  { icon: ChangeBGIcon, name: '배경 변경', alt: 'remove background' },
  { icon: RemoveBGIcon, name: '배경 제거', alt: 'translation' },
  { icon: improveImgIcon, name: '해상도 향상', alt: 'voice dictation' },
  { icon: RemakeImgIcon, name: '이미지 리메이크', alt: 'ai video' },
  { icon: ExpandImgIcon, name: '이미지 확장', alt: 'ai video' },
  { icon: ChangeStyleIcon, name: '스타일 변환', alt: 'ai video' },
  { icon: Convert2DTo3DIcon, name: '2D -> 3D', alt: 'ai video' }
];

const NovaHome = () => {
  return (
    <>
      <S.Body>
        <S.ToolWrap>
          <S.ToolTitle>
            <span>AI 도구</span>
            <img src={creditIcon} alt="credit" />
          </S.ToolTitle>
          <S.AIToolWrap>
            {AI_TOOLS.map((tool, index) => (
              <div key={index}>
                <img src={tool.icon} alt={tool.alt} />
                <span>{tool.name}</span>
              </div>
            ))}
          </S.AIToolWrap>
        </S.ToolWrap>
        <S.ToolWrap style={{ paddingRight: 0 }}>
          <S.ToolTitle>
            <span>AI 이미지</span>
            <img src={creditIcon} alt="credit" />
          </S.ToolTitle>
          <S.AIImageWrap>
            <Swiper
              slidesPerView="auto"
              spaceBetween={8}
              pagination={{
                clickable: true
              }}
              modules={[Pagination]}>
              {AI_IMAGES.map((tool, index) => (
                <SwiperSlide key={index}>
                  <img src={tool.icon} alt={tool.alt} />
                  <span>{tool.name}</span>
                </SwiperSlide>
              ))}
            </Swiper>
          </S.AIImageWrap>
        </S.ToolWrap>
        <Banner />
      </S.Body>
    </>
  );
};

export default NovaHome;
