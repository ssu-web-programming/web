import { ReactComponent as IconSentence } from 'img/light/aiChat/ico_sentence.svg';
import { ReactComponent as IconTable } from 'img/light/aiChat/ico_table.svg';
import { ReactComponent as IconList } from 'img/light/aiChat/ico_table_of_contents.svg';
import { useTranslation } from 'react-i18next';
import { getIconColor } from 'util/getColor';

import { recSubType, recType } from '../../../store/slices/recFuncSlice';
import IconBoxTextButton from '../../buttons/IconBoxTextButton';
import Grid from '../../layout/Grid';

export type EngineVersion =
  | 'gpt3.5'
  | 'gpt4'
  | 'gpt-4.1'
  | 'clovax'
  | 'claude4'
  | 'gpt5'
  | 'exaone-4.0'
  | 'solar-pro-2';

export interface VersionListType {
  id: string;
  version: EngineVersion;
  group: 'all' | null;
}

interface FormListType {
  id: string;
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
}

interface LengthListType {
  id: string;
  length: string;
}

export interface WriteOptions {
  input: string;
  version: VersionListType;
  form: FormListType;
  length: LengthListType;
}

export const DEFAULT_WRITE_OPTION_FORM_VALUE: FormListType = {
  id: 'paragraph',
  icon: IconSentence
};

export const formRecList = [
  DEFAULT_WRITE_OPTION_FORM_VALUE,
  { id: 'list', icon: IconList },
  {
    id: 'table',
    icon: IconTable
  }
];

const versionGpt3: VersionListType = {
  id: 'GPT 3.5',
  version: 'gpt3.5',
  group: 'all'
};
const versionGpt4: VersionListType = {
  id: 'GPT 4',
  version: 'gpt4',
  group: 'all'
};
export const versionGpt4_1: VersionListType = {
  id: 'GPT 4.1',
  version: 'gpt-4.1',
  group: 'all'
};
export const versionClova: VersionListType = {
  id: 'CLOVA X',
  version: 'clovax',
  group: 'all'
};
export const versionClaude: VersionListType = {
  id: 'Claude 4.0 Sonnet',
  version: 'claude4',
  group: 'all'
};
export const versionGpt5: VersionListType = {
  id: 'GPT 5',
  version: 'gpt5',
  group: 'all'
};

export const versionList: VersionListType[] = [
  versionGpt4,
  versionGpt4_1,
  versionGpt3,
  versionClova,
  versionClaude
];

export const DEFAULT_WRITE_OPTION_LENGTH_VALUE: LengthListType = {
  id: 'Short',
  length: 'short'
};

export const lengthList = [
  DEFAULT_WRITE_OPTION_LENGTH_VALUE,
  { id: 'Medium', length: 'medium' },
  { id: 'Long', length: 'long' }
];

const FormRec = ({
  onClick,
  selectedRecFunction
}: {
  onClick: (rec: recSubType) => void;
  selectedRecFunction: recType | null;
}) => {
  const { t } = useTranslation();

  return (
    <Grid col={formRecList.length}>
      {formRecList.map((rec) => (
        <IconBoxTextButton
          key={rec.id}
          variant="white"
          width="full"
          height={48}
          iconSize="md"
          iconSrc={<rec.icon color={getIconColor(rec.id, selectedRecFunction?.id ?? '')} />}
          selected={selectedRecFunction ? selectedRecFunction.id === rec.id : false}
          onClick={() => onClick({ id: rec.id })}>
          {t(`FormList.${rec.id}`)}
        </IconBoxTextButton>
      ))}
    </Grid>
  );
};

export default FormRec;
