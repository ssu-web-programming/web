import { ChangeEvent, ReactElement, useState } from 'react';

import * as S from './style';

function AIVideoPage(): ReactElement {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [selectedAvatar, setSelectedAvatar] = useState<string>('');
  const [selectedVoice, setSelectedVoice] = useState<string>('');
  const [script, setScript] = useState<string>('');
  const [gender, setGender] = useState<string>('all');

  const handleScriptChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setScript(e.target.value);
  };

  const handleGenderChange = (selected: string) => {
    setGender(selected);
  };

  return (
    <S.Container>
      <S.Content>
        <S.StepperContainer>
          <S.StepIconsContainer>
            <S.StepItem>
              <S.StepIconWrapper>
                <S.StepIcon selected={currentStep >= 1}>
                  <S.StepNumber>1</S.StepNumber>
                </S.StepIcon>
              </S.StepIconWrapper>
              <S.StepLabel selected={currentStep >= 1}>아바타 선택</S.StepLabel>
            </S.StepItem>
            <S.StepConnector selected={currentStep >= 2} />
            <S.StepItem>
              <S.StepIconWrapper>
                <S.StepIcon selected={currentStep >= 2}>
                  <S.StepNumber>2</S.StepNumber>
                </S.StepIcon>
              </S.StepIconWrapper>
              <S.StepLabel selected={currentStep >= 2}>목소리 선택</S.StepLabel>
            </S.StepItem>
            <S.StepConnector selected={currentStep >= 3} />
            <S.StepItem>
              <S.StepIconWrapper>
                <S.StepIcon selected={currentStep >= 3}>
                  <S.StepNumber>3</S.StepNumber>
                </S.StepIcon>
              </S.StepIconWrapper>
              <S.StepLabel selected={currentStep >= 3}>대본 작성</S.StepLabel>
            </S.StepItem>
          </S.StepIconsContainer>
        </S.StepperContainer>

        <S.MainContent>
          <S.PreviewSection>
            <S.VideoPreview>
              <S.PreviewPlaceholder />
            </S.VideoPreview>
            <S.VoicePreview>
              <S.AvatarImagePlaceholder />
              <S.VoiceInfo>
                <S.VoiceName>Kim-Professional</S.VoiceName>
                <S.VoiceDetails>
                  <S.FlagPlaceholder />
                  <S.VoiceDetail>South Korea</S.VoiceDetail>
                  <S.Divider>|</S.Divider>
                  <S.VoiceDetail>Female</S.VoiceDetail>
                </S.VoiceDetails>
              </S.VoiceInfo>
              <S.VolumeIcon />
            </S.VoicePreview>
          </S.PreviewSection>

          <S.SelectionSection>
            <S.FilterSection>
              <S.GenderFilter>
                <S.RadioGroup>
                  <S.RadioItem>
                    <S.RadioButton
                      checked={gender === 'all'}
                      onClick={() => handleGenderChange('all')}
                    />
                    <S.RadioLabel>전체</S.RadioLabel>
                  </S.RadioItem>
                  <S.RadioItem>
                    <S.RadioButton
                      checked={gender === 'female'}
                      onClick={() => handleGenderChange('female')}
                    />
                    <S.RadioLabel>여성</S.RadioLabel>
                  </S.RadioItem>
                  <S.RadioItem>
                    <S.RadioButton
                      checked={gender === 'male'}
                      onClick={() => handleGenderChange('male')}
                    />
                    <S.RadioLabel>남성</S.RadioLabel>
                  </S.RadioItem>
                </S.RadioGroup>
              </S.GenderFilter>
              <S.GridContainer>
                <S.GridRow>
                  <S.GridItem />
                  <S.GridItem />
                  <S.GridItem />
                  <S.GridItem />
                </S.GridRow>
                <S.GridRow>
                  <S.GridItem />
                  <S.GridItem />
                  <S.GridItem />
                  <S.GridItem />
                </S.GridRow>
                <S.GridRow>
                  <S.GridItem />
                  <S.GridItem />
                  <S.GridItem />
                  <S.GridItem />
                </S.GridRow>
                <S.GridRow>
                  <S.GridItem />
                  <S.GridItem />
                  <S.GridItem />
                  <S.GridItem />
                </S.GridRow>
              </S.GridContainer>
            </S.FilterSection>
          </S.SelectionSection>
        </S.MainContent>
      </S.Content>

      <S.Footer>
        <S.NextButton>다음</S.NextButton>
        <S.APIText>Uses Heygen API</S.APIText>
      </S.Footer>
    </S.Container>
  );
}

export default AIVideoPage;
