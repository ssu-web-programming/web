import styled from 'styled-components';

export const Body = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  gap: 16px;
  padding: 24px 12px;
`;

export const ToolWrap = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  gap: 16px;
  padding: 16px;
  background-color: white;
  border-radius: 12px;
`;

export const ToolTitle = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;

  span {
    font-size: 18px;
    font-weight: 700;
    line-height: 27px;
    color: var(--gray-gray-90-01);
  }

  img {
    width: 24px;
    height: 24px;
  }
`;

export const AIToolWrap = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;

  div {
    min-width: 75px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
  }

  img {
    width: 40px;
    height: 40px;
  }

  span {
    font-size: 16px;
    font-weight: 500;
    line-height: 24px;
    color: var(--gray-gray-80-02);
    white-space: nowrap;
  }
`;

export const AIImageWrap = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  .swiper {
    width: 100%;
  }

  .swiper-pagination {
    display: none;
  }

  .swiper-slide {
    width: 120px !important;
    margin-right: 8px !important;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  //div {
  //  min-width: 80px;
  //  display: flex;
  //  flex-direction: column;
  //  align-items: center;
  //  justify-content: space-between;
  //}

  img {
    width: 120px;
    height: 80px;
    border-radius: 8px;
  }

  span {
    font-size: 16px;
    font-weight: 500;
    line-height: 24px;
    color: var(--gray-gray-80-02);
    white-space: nowrap;
  }
`;
