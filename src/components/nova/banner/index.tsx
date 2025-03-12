import { Navigation, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

import BannerEn1 from '../../../img/common/nova/banner/banner1_nova_en.png';
import BannerJa1 from '../../../img/common/nova/banner/banner1_nova_jp.png';
import BannerKo1 from '../../../img/common/nova/banner/banner1_nova_ko.png';
import BannerEn2 from '../../../img/common/nova/banner/banner2_nova_en.png';
import BannerJa2 from '../../../img/common/nova/banner/banner2_nova_jp.png';
import BannerKo2 from '../../../img/common/nova/banner/banner2_nova_ko.png';
import { lang } from '../../../locale';
import Bridge from '../../../util/bridge';

import * as S from './style';

import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

const bannerImages = [
  {
    image: {
      ko: BannerKo1,
      en: BannerEn1,
      ja: BannerJa1
    },
    url: `https://vf-ca-cloud.polarisoffice.com/${lang}/ai`
  },
  {
    image: {
      ko: BannerKo2,
      en: BannerEn2,
      ja: BannerJa2
    }
  }
];

const Banner = () => {
  const handleOpenPage = (url: string) => {
    if (url === '') return;
    Bridge.callBridgeApi('openWindow', url);
  };

  return (
    <S.SwiperWrapper>
      <Swiper
        pagination={{
          type: 'fraction'
        }}
        navigation={true}
        modules={[Pagination, Navigation]}>
        {bannerImages.map((banner, index) => (
          <SwiperSlide
            className="swiper-slide"
            key={index}
            onClick={() => handleOpenPage(banner.url ?? '')}>
            <img src={banner.image[lang] || BannerEn2} alt="banner" />
          </SwiperSlide>
        ))}
      </Swiper>
    </S.SwiperWrapper>
  );
};

export default Banner;
