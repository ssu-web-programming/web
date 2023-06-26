import styled from 'styled-components';
import { alignItemCenter, flex, flexColumn, justiCenter } from '../style/cssCommon';
import Header from '../components/layout/Header';
import { useTranslation } from 'react-i18next';

const Wrapper = styled.div`
  ${flex}
  ${flexColumn}
  
  width: 100%;
  height: 100%;
`;

const Contents = styled.div`
  ${flex}
  ${flexColumn}
  ${justiCenter}
  ${alignItemCenter}
  
  flex: 1;
`;

const TextWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const InvalidAccess = () => {
  const { t } = useTranslation();
  return (
    <Wrapper>
      <Header title={t('AITools')} subTitle=""></Header>
      <Contents>
        <div>
          <svg
            width="56px"
            height="56px"
            viewBox="0 0 56 56"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg">
            <title>ico/service_error</title>
            <g
              id="ico/service_error"
              stroke="none"
              stroke-width="1"
              fill="none"
              fill-rule="evenodd">
              <rect id="Rectangle" x="0" y="0" width="56" height="56"></rect>
              <g
                id="Group-2"
                transform="translate(5.000000, 7.000000)"
                fill="#E0D1FF"
                fill-rule="nonzero">
                <g id="Group" transform="translate(21.000000, 11.000000)">
                  <polygon id="Line" points="3 0 3 13 0 13 0 0"></polygon>
                  <polygon id="Line-Copy" points="3 16 3 20 0 20 0 16"></polygon>
                </g>
                <path
                  d="M24.6940409,0.409298153 C26.2616024,1.0179175 27.5009618,2.25480102 28.1100444,3.81847733 L30.1627174,9.08593896 L30.9857665,9.1810005 C39.2707739,10.2008152 45,12.8485499 45,17.1765636 C45,20.5478884 41.5236789,22.8996706 36.0709524,24.2566577 L39.8048928,33.8422517 C41.0047163,36.9225165 39.4733455,40.3895055 36.3844804,41.5859883 C34.7282617,42.2275305 32.8720852,42.104066 31.3159805,41.2488544 L22.518734,36.4140209 L13.6831277,41.2586159 C10.7794008,42.85074 7.13118977,41.7940298 5.53462039,38.8983877 C4.67875555,37.3461355 4.55662411,35.4954873 5.20111269,33.8447716 L8.94306067,24.2601418 C3.4822777,22.9036979 0,20.5507755 0,17.1765636 C0,12.7014048 6.12541631,10.0227204 14.8679997,9.08262762 L16.9259889,3.81408074 C18.1282474,0.734760224 21.6061227,-0.789612864 24.6940409,0.409298153 Z M19.7203676,4.90561532 L17.698,10.081 L16.4094404,13.3842063 L12.978,22.171 L11.737635,25.3511752 L7.99566959,34.9358499 C7.67504222,35.7570663 7.73577149,36.6772923 8.16174718,37.4498695 C8.95917035,38.8961281 10.7865792,39.42544 12.2407987,38.6280862 L21.0764049,33.7834911 L22.5204187,32.9917331 L23.9636522,33.7849124 L32.7608987,38.6197459 C33.5403303,39.0481097 34.4709264,39.1100088 35.3008734,38.7885259 C36.8439762,38.1907996 37.6066282,36.4641728 37.0094909,34.9311632 L33.2755505,25.3455692 L33.106,24.91 L32.1610752,22.4852628 L28.6171364,13.3857161 L26.7495967,8.59055319 L25.3146263,4.90734743 C25.0110022,4.12786381 24.3921856,3.51028344 23.6082332,3.20590711 C22.0614996,2.60537439 20.3205206,3.3684557 19.7203676,4.90561532 Z M13.6149322,12.2930032 L12.8967135,12.4019982 C6.9873376,13.3443135 3,15.1294681 3,17.1765636 C3,18.8755293 5.74647726,20.3940701 10.0587782,21.4001084 L13.6149322,12.2930032 Z M31.4126077,12.2969828 L34.9565465,21.3965296 C39.2600285,20.3904707 42,18.8735159 42,17.1765636 C42,15.0506868 37.6998562,13.2073002 31.4126077,12.2969828 Z"
                  id="Combined-Shape"></path>
              </g>
            </g>
          </svg>
        </div>
        <TextWrapper>유효하지 않은 접근입니다.</TextWrapper>
      </Contents>
    </Wrapper>
  );
};

export default InvalidAccess;
