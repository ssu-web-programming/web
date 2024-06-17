import { MenuItem, Select, TextField } from '@mui/material';
import styled from 'styled-components';
import { ResponseAppInputInfo, isSlideNoteApp } from './Alli';
import React from 'react';

const Fieldset = styled.fieldset`
  border: none;
  margin: 0px;
  min-width: auto;
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
  compProps?: any;
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
    component: ({ inputs, setInputs, info, compProps }) => (
      <TextField
        {...compProps}
        multiline
        placeholder={info.placeholder}
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

const wrapper = (legend: string, component: React.ReactNode, slideNum?: string) => (
  <Fieldset key={legend}>
    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
      <Legend>{legend}</Legend>
      {slideNum && (
        <div
          style={{
            fontSize: '13px',
            fontWeight: 500,
            lineHeight: '18.82px',
            textAlign: 'left',
            color: '#6F3AD0'
          }}>
          {slideNum}
        </div>
      )}
    </div>
    {component}
  </Fieldset>
);

export default function build(
  {
    appId,
    props,
    GetSlideContentsButton,
    slideNum
  }: {
    appId: string;
    props: ResponseAppInputInfo[];
    GetSlideContentsButton: React.ReactNode;
    slideNum?: string;
  },
  setInputs: React.Dispatch<React.SetStateAction<any>>,
  inputs: any
): React.ReactNode {
  const result = props.map((prop) => {
    const found = template.find((t) => t.inputType === prop.inputType);
    return found ? (
      <>
        {wrapper(
          prop.name,
          found.component({
            inputs,
            setInputs: (val) => setInputs((prev: any) => ({ ...prev, [prop.value]: val })),
            info: prop,
            compProps:
              prop.inputType === 'paragraph' && isSlideNoteApp(appId) && !slideNum
                ? { disabled: true }
                : undefined
          }),
          prop.inputType === 'paragraph' && isSlideNoteApp(appId) ? slideNum : undefined
        )}
        {prop.inputType === 'paragraph' && isSlideNoteApp(appId) && GetSlideContentsButton}
      </>
    ) : (
      <></>
    );
  });

  return result;
}
