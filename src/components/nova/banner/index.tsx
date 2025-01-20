import { Navigation, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

import BannerImg from '../../../img/common/banner_test01.png';

import * as S from './style';

import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

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
          <img src={BannerImg} alt="banner" />
        </SwiperSlide>
        <SwiperSlide className="swiper-slide">
          <img src={BannerImg} alt="banner" />
        </SwiperSlide>
        <SwiperSlide className="swiper-slide">
          <img src={BannerImg} alt="banner" />
        </SwiperSlide>
        <SwiperSlide className="swiper-slide">
          <img src={BannerImg} alt="banner" />
        </SwiperSlide>
      </Swiper>
    </S.SwiperWrapper>
  );
};

export default Banner;
