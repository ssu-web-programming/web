import styled from 'styled-components';

export const Wrapper = styled.div`
  width: 100%;
  padding: 80px 200px;
  display: flex;
  flex-direction: column;
  gap: 40px;

  @media (max-width: 768px) {
    padding: 24px 16px !important;
  }
`;

export const EmptyWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 40px;
`;

export const EmptyBox = styled.div`
  width: 100%;
  height: 548px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: ${({ theme }) => theme.color.subBgGray04};
  color: ${({ theme }) => theme.color.text.subGray01};
`;

export const Header = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  gap: 20px;
`;

export const DateWithGuide = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
  }

  .date {
    font-size: 20px;
    font-weight: 700;
    line-height: 30px;
    color: #26282b;
  }

  .guide {
    font-size: 14px;
    font-weight: 400;
    line-height: 21px;
    color: #454c53;
  }
`;

export const Content = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 20px;
  align-items: flex-start;
  justify-content: center;
`;

export const Message = styled.div`
  display: flex;
  justify-content: center;
  gap: 8px;

  img {
    max-width: 160px;
    align-self: flex-start;
  }

  table {
    border-collapse: collapse;
    border-radius: 6px;
    width: 100%;
  }

  th,
  td {
    padding: 1em;
    padding-top: 0.5em;
    padding-bottom: 0.5em;
  }

  table,
  tr,
  td,
  th {
    border-radius: 6px;
    border: 1px solid #e0d1ff;
    padding: 15px 10px;
  }

  th {
    border: 1px solid #e0d1ff;
    color: #6f3ad0;
    background: #f5f1fd;
    padding: 10px 10px;
  }
`;

export const Detail = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
`;

export const FileItem = styled.div`
  width: fit-content;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-top: 10px;
  padding: 6px;
  border: 1px solid var(--gray-gray-40);
  border-radius: 8px;
  background: var(--gray-gray-20);

  font-size: 14px;
  line-height: 21px;
  text-align: left;
  color: var(--gray-gray-90-01);
`;

export const Logo = styled.img`
  width: 22px;
  height: 28px;
`;
