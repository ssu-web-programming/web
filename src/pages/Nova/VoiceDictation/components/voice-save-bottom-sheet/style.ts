import styled from 'styled-components';

const Container = styled.div`
  padding: 0px 16px 40px;
`;

const Title = styled.p`
  font-size: 20px;
  font-weight: 600;
  line-height: 30px;
`;

const ItemWrapper = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 8px;
`;
const Item = styled.div`
  display: flex;
  flex-grow: 1;
  flex-basis: 0;
  background: #f7f8f9;
  height: 100px;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 8px;
`;

export { Container, Item, ItemWrapper, Title };
