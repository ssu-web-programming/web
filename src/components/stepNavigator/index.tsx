import * as React from 'react';
import { useEffect, useRef, useState } from 'react';
import Button from '@mui/material/Button';
import Step from '@mui/material/Step';
import StepIcon from '@mui/material/StepIcon';
import { useTranslation } from 'react-i18next';

import { NOVA_TAB_TYPE } from '../../constants/novaTapTypes';
import { ReactComponent as ArrowDarkIcon } from '../../img/dark/ico_arrow_down_normal.svg';
import { ReactComponent as ArrowLightIcon } from '../../img/light/ico_arrow_down_normal.svg';
import { lang } from '../../locale';
import { setPageStatus } from '../../store/slices/nova/pageStatusSlice';
import { themeInfoSelector } from '../../store/slices/theme';
import { useAppDispatch, useAppSelector } from '../../store/store';
import { stepOrder } from '../nova/aiVideo';

import * as S from './style';

interface StepNavigatorProps {
  activeStep: number;
  steps: { label: React.ReactNode; children: React.ReactNode }[];
}

export default function StepNavigator({ activeStep, steps }: StepNavigatorProps) {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const { isLightMode } = useAppSelector(themeInfoSelector);
  const selectedStepRef = useRef<HTMLDivElement>(null);
  const [selectedStepWidth, setSelectedStepWidth] = useState<number>(0);

  useEffect(() => {
    if (selectedStepRef.current) {
      setSelectedStepWidth(selectedStepRef.current.offsetWidth);
    }
  }, []);

  useEffect(() => {
    document.querySelectorAll('.MuiStep-root').forEach((el) => {
      if (el.querySelector('.Mui-completed')) {
        el.classList.add('step-has-completed');
      } else {
        el.classList.remove('step-has-completed');
      }

      if (el.querySelector('.Mui-disabled')) {
        el.classList.add('step-has-disabled');
      } else {
        el.classList.remove('step-has-disabled');
      }
    });

    document.querySelectorAll('.MuiStepLabel-root').forEach((el) => {
      if (el.querySelector('.Mui-completed')) {
        el.classList.add('step-label-has-completed');
      } else {
        el.classList.remove('step-label-has-completed');
      }

      if (el.querySelector('.Mui-disabled')) {
        el.classList.add('step-label-has-disabled');
      } else {
        el.classList.remove('step-label-has-disabled');
      }
    });
  }, [steps]);

  const handleMove = (index: number) => {
    if (index === activeStep) return;

    const newStatus = stepOrder[index];
    if (newStatus) {
      dispatch(setPageStatus({ tab: NOVA_TAB_TYPE.aiVideo, status: newStatus }));
    }
  };
  const CustomStepIcon = (props: any) => {
    const { active, completed, className } = props;
    if (completed) {
      return isLightMode ? (
        <ArrowLightIcon className={className} width={22} height={22} />
      ) : (
        <ArrowDarkIcon className={className} width={22} height={22} />
      );
    } else if (active) {
      return <StepIcon {...props} />;
    } else {
      return isLightMode ? (
        <ArrowLightIcon className={className} width={22} height={22} />
      ) : (
        <ArrowDarkIcon className={className} width={22} height={22} />
      );
    }
  };

  return (
    <S.StepWrap>
      <S.Step
        activeStep={activeStep}
        connector={<S.StepLine />}
        isStared={activeStep === 0}
        isFinished={activeStep === steps.length - 1}
        width={selectedStepWidth}
        isWide={lang != 'ko'}>
        {steps.map((step, index) => {
          const stepProps: { completed?: boolean } = {};
          return (
            <Step
              key={index}
              {...stepProps}
              onClick={() => handleMove(index)}
              ref={activeStep === index ? selectedStepRef : null}>
              <S.Label StepIconComponent={CustomStepIcon}>
                {activeStep === index
                  ? step.label
                  : index < activeStep
                    ? t('Nova.aiVideo.button.prev')
                    : t('Nova.aiVideo.button.next')}
              </S.Label>
            </Step>
          );
        })}
      </S.Step>
      <React.Fragment>
        <S.Container>{steps[activeStep].children}</S.Container>
      </React.Fragment>
    </S.StepWrap>
  );
}
