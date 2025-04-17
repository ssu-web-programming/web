import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: #f7f8f9;
`;

export const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #c9cdd2;
  background-color: white;
`;

export const BackButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  color: #454c53;
  background: none;
  border: none;
  cursor: pointer;
`;

export const IconPlaceholder = styled.div`
  width: 24px;
  height: 24px;
  background-color: #e8ebed;
  border-radius: 4px;
`;

export const Title = styled.h1`
  font-family: 'Pretendard', sans-serif;
  font-weight: 500;
  font-size: 18px;
  line-height: 1.5;
  color: #26282b;
  margin: 0;
`;

export const HeaderButtons = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const CreditButton = styled.button`
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  cursor: pointer;
`;

export const CreditIcon = styled.div`
  width: 20px;
  height: 20px;
  border: 2px solid #454c53;
  border-radius: 50%;
`;

export const MaximizeButton = styled.button`
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #454c53;
  background: none;
  border: none;
  cursor: pointer;
`;

export const Content = styled.main`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

export const StepperContainer = styled.div`
  width: 100%;
  position: relative;
`;

export const StepIconsContainer = styled.div`
  display: flex;
  align-items: flex-start;
  position: relative;
  width: 100%;
  min-height: 76px;
  margin-top: 16px;
  margin-bottom: 16px;
  padding: 0 16px;
`;

export const StepLabelsContainer = styled.div`
  display: flex;
  width: 100%;
`;

export const StepItem = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  z-index: 3;
`;

export const StepIconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  position: relative;
  height: 24px;
  margin-bottom: 4px;
`;

export const StepIcon = styled.div<{ selected: boolean }>`
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${(props) => (props.selected ? '#6F3AD0' : '#C9CDD2')};
  border-radius: 50%;
  z-index: 2;
`;

export const StepNumber = styled.span`
  color: white;
  font-size: 12px;
`;

export const StepLabel = styled.span<{ selected: boolean }>`
  font-family: 'Pretendard', sans-serif;
  font-weight: ${(props) => (props.selected ? 600 : 400)};
  font-size: 14px;
  line-height: 1.43;
  color: ${(props) => (props.selected ? '#26282B' : '#9EA4AA')};
  text-align: center;
  width: 100%;
`;

export const StepConnector = styled.div<{ selected: boolean }>`
  flex: 1;
  height: 1px;
  background-color: ${(props) => (props.selected ? '#6F3AD0' : '#C9CDD2')};
  position: absolute;
  top: 12px;
  left: calc(16.67% + 10px);
  right: calc(16.67% + 10px);
  z-index: 1;
`;

export const MainContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 16px;
  overflow: auto;
`;

export const PreviewSection = styled.section`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 0 16px;
`;

export const VideoPreview = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  padding: 0 16px;
`;

export const PreviewPlaceholder = styled.div`
  width: 248px;
  height: 140px;
  background-color: #b2c7ea;
  border: 2px solid #6f3ad0;
  border-radius: 12px;
`;

export const VoicePreview = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #c9cdd2;
  border-radius: 8px;
  background-color: white;
`;

export const AvatarImagePlaceholder = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #e8ebed;
  border: 1px solid rgba(38, 40, 43, 0.2);
`;

export const VoiceInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

export const VoiceName = styled.h3`
  font-family: 'Pretendard', sans-serif;
  font-weight: 600;
  font-size: 14px;
  line-height: 1.5;
  color: #6f3ad0;
  margin: 0;
`;

export const VoiceDetails = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

export const FlagPlaceholder = styled.div`
  width: 16px;
  height: 12px;
  background-color: #e8ebed;
  border-radius: 2px;
`;

export const VoiceDetail = styled.span`
  font-family: 'Pretendard', sans-serif;
  font-weight: 400;
  font-size: 12px;
  line-height: 1.5;
  color: #9ea4aa;
`;

export const Divider = styled.span`
  font-family: 'Pretendard', sans-serif;
  font-weight: 400;
  font-size: 12px;
  line-height: 1.5;
  color: #9ea4aa;
`;

export const VolumeIcon = styled.div`
  width: 24px;
  height: 24px;
  background-color: #e8ebed;
  border-radius: 4px;
`;

export const SelectionSection = styled.section`
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 0 16px;
  gap: 16px;
`;

export const FilterSection = styled.div`
  display: flex;
  flex-direction: column;
  border: 1px solid #c9cdd2;
  border-radius: 8px;
  background-color: white;
  overflow: hidden;
`;

export const GenderFilter = styled.div`
  padding: 12px;
  border-bottom: 1px solid #e8ebed;
`;

export const RadioGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

export const RadioItem = styled.div`
  display: flex;
  align-items: center;
  gap: 2px;
`;

export const RadioButton = styled.button<{ checked: boolean }>`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  border: 1px solid ${(props) => (props.checked ? '#6F3AD0' : '#9EA4AA')};
  background-color: ${(props) => (props.checked ? '#6F3AD0' : 'transparent')};
  position: relative;
  cursor: pointer;

  &::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background-color: white;
    display: ${(props) => (props.checked ? 'block' : 'none')};
  }
`;

export const RadioLabel = styled.span`
  font-family: 'Pretendard', sans-serif;
  font-weight: 500;
  font-size: 16px;
  line-height: 1.5;
  letter-spacing: -0.02em;
  color: #454c53;
`;

export const GridContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 12px;
`;

export const GridRow = styled.div`
  display: flex;
  gap: 4px;
  width: 100%;
`;

export const GridItem = styled.div`
  flex: 1;
  aspect-ratio: 1;
  border-radius: 6px;
  border: 1px solid #e8ebed;
  background-color: #f7f8f9;
`;

export const Footer = styled.footer`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 12px 0;
  background-color: white;
`;

export const NextButton = styled.button`
  width: 100%;
  height: 48px;
  margin: 0 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #6f3ad0;
  color: white;
  border: none;
  border-radius: 8px;
  font-family: 'Pretendard', sans-serif;
  font-weight: 500;
  font-size: 16px;
  line-height: 1.5;
  cursor: pointer;
`;

export const APIText = styled.p`
  text-align: right;
  padding: 0 16px;
  font-family: 'Pretendard', sans-serif;
  font-weight: 500;
  font-size: 12px;
  line-height: 1.5;
  color: #9ea4aa;
  margin: 0;
`;
