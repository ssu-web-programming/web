import { Navigation, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

import BannerEn from '../../../img/common/nova/banner/banner_nova_en.png';
import BannerJa from '../../../img/common/nova/banner/banner_nova_jp.png';
import BannerKo from '../../../img/common/nova/banner/banner_nova_ko.png';
import { lang } from '../../../locale';

import * as S from './style';

import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

const bannerImages = {
  ko: BannerKo,
  en: BannerEn,
  ja: BannerJa
};

const Banner = () => {
  return (
    <S.SwiperWrapper>
      <Swiper
        pagination={{
          type: 'fraction'
        }}
        navigation={true}
        modules={[Pagination, Navigation]}>
        <SwiperSlide className="swiper-slide">
          <img src={bannerImages[lang] || BannerEn} alt="banner" />
        </SwiperSlide>
      </Swiper>
    </S.SwiperWrapper>
  );
};

export default Banner;
