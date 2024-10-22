import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

import { selectPageResult } from '../../store/slices/nova/pageStatusSlice';
import { NOVA_TAB_TYPE, selectTabSlice } from '../../store/slices/tabSlice';
import { useAppSelector } from '../../store/store';

import GoBackHeader from './GoBackHeader';

const Wrap = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
`;

const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 16px;
  flex: 1 1 0;
  overflow-y: auto;
  background-color: #f4f6f8;
`;

const Body = styled.div`
  width: 100%;
  margin: auto;
`;

const ImageBox = styled.div<{ isBordered: boolean }>`
  width: 240px;
  height: 240px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  border: ${(props) => (props.isBordered ? '1px solid #c9cdd2' : 'none')};
  border-radius: 8px;
  margin: 16px auto;

  div {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  img {
    object-fit: contain;
    max-width: 100%;
    max-height: 100%;
    border-radius: 8px;
  }
`;

export default function Convert() {
  const { t } = useTranslation();
  const { selectedNovaTab } = useAppSelector(selectTabSlice);
  const result = useAppSelector(selectPageResult(selectedNovaTab));

  return (
    <Wrap>
      <GoBackHeader />
      <Container>
        <Body>
          <ImageBox isBordered={selectedNovaTab === NOVA_TAB_TYPE.removeBG}>
            <div>
              {/*<img src={`data:${result?.contentType};base64,${result?.data}`} alt="result" />*/}
              <img
                src={
                  'https://vf-berlin.polarisoffice.com/nova/images/immersity/immersity_gen_72d841aa-c5d5-4d1a-b903-4f2f34d1a6de.gif'
                }
                alt="sample"
              />
            </div>
          </ImageBox>
        </Body>
      </Container>
    </Wrap>
  );
}
