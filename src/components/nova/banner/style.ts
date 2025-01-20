import styled from 'styled-components';

export const SwiperWrapper = styled.div`
  width: 100%;

  .swiper {
    width: 100%;
    height: 120px;
  }

  .swiper-pagination {
    display: flex;
    align-items: center;
    justify-content: center;
    bottom: 12px;
  }

  .swiper-pagination-bullet {
    width: 4px;
    height: 4px;
    background-color: rgba(255, 255, 255, 0.4);
  }

  .swiper-pagination-bullet-active {
    width: 6px;
    height: 6px;
    background-color: white;
  }

  .swiper-slide {
    img {
      width: 100%;
    }
  }
`;
