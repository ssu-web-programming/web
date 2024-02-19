import { MenuItem, Select, TextField } from '@mui/material';
import styled from 'styled-components';
import { ResponseAppInputInfo, ResponseAppInputOption } from './Alli';

const Fieldset = styled.fieldset`
  border: none;
  margin: 0px;
  padding: 0px;
  & + & {
    margin-top: 16px;
  }
`;
const Legend = styled.legend`
  font-size: 13px;
  font-weight: 500;
  margin-bottom: 4px;
`;

interface BuilderProps {
  inputs: any;
  setInputs: (val: string) => void;
  info: ResponseAppInputInfo;
}

type ComponentType = 'text' | 'paragraph' | 'single';

type Template = {
  inputType: ComponentType;
  component: (props: BuilderProps) => React.ReactNode;
};
const template: Template[] = [
  {
    inputType: 'text',
    component: ({ inputs, setInputs, info }) => (
      <TextField
        size="small"
        fullWidth
        value={inputs[info.value] || ''}
        onChange={(e) => setInputs(e.target.value)}
      />
    )
  },
  {
    inputType: 'paragraph',
    component: ({ inputs, setInputs, info }) => (
      <TextField
        multiline
        rows={8}
        fullWidth
        value={inputs[info.value] || ''}
        onChange={(e) => setInputs(e.target.value)}></TextField>
    )
  },
  {
    inputType: 'single',
    component: ({ inputs, setInputs, info }) => (
      <Select size="small" fullWidth value={inputs[info.value] || ''}>
        {info.options.map((opt) => (
          <MenuItem key={opt.name} value={opt.value} onClick={() => setInputs(opt.value)}>
            {opt.name}
          </MenuItem>
        ))}
      </Select>
    )
  }
];

const wrapper = (legend: string, component: React.ReactNode) => (
  <Fieldset key={legend}>
    <Legend>{legend}</Legend>
    {component}
  </Fieldset>
);

export default function build(
  props: ResponseAppInputInfo[],
  setInputs: React.Dispatch<React.SetStateAction<any>>,
  inputs: any
): React.ReactNode {
  const result = props.map((prop) => {
    const found = template.find((t) => t.inputType === prop.inputType);
    return found ? (
      wrapper(
        prop.name,
        found.component({
          inputs,
          setInputs: (val) => setInputs((prev: any) => ({ ...prev, [prop.value]: val })),
          info: prop
        })
      )
    ) : (
      <></>
    );
  });

  return result;
}
