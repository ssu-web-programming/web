import styled from 'styled-components';
import { alignItemCenter, flex, justiCenter } from '../style/cssCommon';

type ProgressBarProp = {
  progressPer: number;
};

const ProgressWrap = styled.div`
  width: 100%;
  height: 40px;
  position: relative;
  background-color: #f2f4f6;
  border-radius: 4px;
  font-size: 14px;
`;

const Progress = styled.div<{ width?: number }>`
  &.back {
    border-radius: 4px;
    .bg {
      width: ${(props) => props.width}%;
      position: absolute;
      height: 40px;
      background: linear-gradient(to left, #a86cea, var(--ai-purple-50-main));
      border-radius: 4px;
      transition: width 0.5 ease-out;
    }
  }
`;

const Text = styled.div<{ width?: number }>`
  &.back_num {
    ${flex}
    ${alignItemCenter}
    ${justiCenter}
    
    position: relative;
    height: 40px;
    color: #000;
    z-index: 2;
  }

  &.front_num {
    ${flex}
    ${alignItemCenter}
    ${justiCenter}
    
    z-index: 2;
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    color: #fff;
    height: 40px;
    mask: url(https://polink-static-contents.polarisoffice.com/web/assets/img/contents/ho/img_solution.jpg)
      0 0 no-repeat;
    mask-size: ${(props) => props.width}% 30px;
  }
`;

export default function ProgressBar({ progressPer }: ProgressBarProp) {
  return (
    <ProgressWrap>
      <Progress className="back" width={progressPer}>
        <div className="bg"></div>
        <Text className="back_num">{progressPer}%</Text>
      </Progress>
      <Progress>
        <Text className="front_num" width={progressPer}>
          {progressPer}%
        </Text>
      </Progress>
    </ProgressWrap>
  );
}
