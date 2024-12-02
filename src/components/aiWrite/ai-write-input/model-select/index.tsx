import { useEffect, useState } from 'react';
import SelectModelButton from 'components/buttons/select-model-button';
import Select from 'components/select';
import { CREDIT_DESCRITION_MAP, CREDIT_NAME_MAP } from 'constants/credit';
import { creditInfoSelector } from 'store/slices/creditInfo';
import { useAppSelector } from 'store/store';
import { css } from 'styled-components';

const defaultOptions = [
  {
    value: 'WRITE_GPT4O',
    component: (
      <SelectModelButton
        item={{
          id: 'WRITE_GPT4O',
          desc: CREDIT_DESCRITION_MAP['WRITE_GPT4O'],
          title: CREDIT_NAME_MAP['WRITE_GPT4O'],
          deductCredit: ''
        }}
      />
    ),
    selected: false
  },
  {
    value: 'WRITE_GPT4',
    component: (
      <SelectModelButton
        item={{
          id: 'WRITE_GPT4',
          desc: CREDIT_DESCRITION_MAP['WRITE_GPT4'],
          title: CREDIT_NAME_MAP['WRITE_GPT4'],
          deductCredit: ''
        }}
      />
    ),
    selected: false
  },
  {
    value: 'GPT3',
    component: (
      <SelectModelButton
        item={{
          id: 'GPT3',
          desc: CREDIT_DESCRITION_MAP['GPT3'],
          title: CREDIT_NAME_MAP['GPT3'],
          deductCredit: ''
        }}
      />
    ),
    selected: false
  },
  {
    value: 'WRITE_CLOVA',
    component: (
      <SelectModelButton
        item={{
          id: 'WRITE_CLOVA',
          desc: CREDIT_DESCRITION_MAP['WRITE_CLOVA'],
          title: CREDIT_NAME_MAP['WRITE_CLOVA'],
          deductCredit: ''
        }}
      />
    ),
    selected: false
  },
  {
    value: 'WRITE_CLADE3',
    component: (
      <SelectModelButton
        item={{
          id: 'WRITE_CLADE3',
          desc: CREDIT_DESCRITION_MAP['WRITE_CLADE3'],
          title: CREDIT_NAME_MAP['WRITE_CLADE3'],
          deductCredit: ''
        }}
      />
    ),
    selected: false
  }
];

interface Props {
  selectedOption: 'WRITE_GPT4O' | 'WRITE_GPT4' | 'GPT3' | 'WRITE_CLOVA' | 'WRITE_CLADE3';
  onChangeOption: any;
}

export default function ModelSelect({ selectedOption, onChangeOption }: Props) {
  const creditInfo = useAppSelector(creditInfoSelector);
  const [options, setOptions] = useState(defaultOptions);

  useEffect(() => {
    if (creditInfo) {
      const addLeftCreditOption = defaultOptions.map((option) => {
        const findTargetCreditInfo = creditInfo.find((el) => el.serviceType === option.value);
        return {
          ...option,
          selected: selectedOption === option.value,
          component: (
            <SelectModelButton
              item={{
                ...option.component.props.item,
                deductCredit: findTargetCreditInfo?.deductCredit
              }}
              hideSelectedStyles={true}
              buttonStyle={css`
                padding: 0px;
              `}
            />
          )
        };
      });

      setOptions(addLeftCreditOption);
    }
  }, [creditInfo, selectedOption]);

  console.log('options', options);

  return (
    <Select
      options={options}
      onChange={onChangeOption}
      value={selectedOption}
      iconStyles={css`
        right: 12px;
      `}
      selectButtonStyle={css`
        padding: 8px 36px 8px 16px;
      `}
      optionContainerStyle={css`
        width: 100%;
        max-height: 100vh;
        padding: 0px;
      `}
      optionStyle={css`
        border-bottom: none !important;
        padding: 8px 16px;
        margin: 8px;
      `}
      containerStylesSelectedOption={true}
    />
  );
}
