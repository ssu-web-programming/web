import styled from 'styled-components';

export const SwiperWrapper = styled.div`
  width: 100%;

  .swiper {
    width: 100%;
  }

  .swiper-button-prev,
  .swiper-button-next {
    display: none;
  }

  .swiper-pagination {
    width: fit-content;
    left: auto;
    right: 8px;
    bottom: 8px;
    background-color: var(--black-alpha);
    padding: 3.5px 8px;
    border-radius: 12px;
    font-size: 11px;
    font-weight: 400;
    line-height: 11px;
    color: var(--white);
  }
`;

export const Image = styled.img`
  width: 100%;
  cursor: pointer;
`;
