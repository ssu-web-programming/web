import Grid from '../../layout/Grid';
import IconBoxTextButton from '../../buttons/IconBoxTextButton';
import { ReactComponent as IconSentence } from 'img/aiChat/ico_sentence.svg';
import { ReactComponent as IconTable } from 'img/aiChat/ico_table.svg';
import { ReactComponent as IconList } from 'img/aiChat/ico_table_of_contents.svg';
import { useTranslation } from 'react-i18next';
import { recSubType, recType } from '../../../store/slices/recFuncSlice';
import { LANG_KO_KR, lang } from '../../../locale';

export type EngineVersion = 'gpt3.5' | 'gpt4' | 'gpt4o' | 'clovax';

export interface VersionListType {
  id: string;
  version: EngineVersion;
  group: 'gpt' | 'clova' | null;
}

interface FormListType {
  id: string;
  icon: string | React.FC<React.SVGProps<SVGSVGElement>>;
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
  id: 'GPT-3.5',
  version: 'gpt3.5',
  group: 'gpt'
};
const versionGpt4: VersionListType = {
  id: 'GPT-4',
  version: 'gpt4',
  group: 'gpt'
};
export const versionGpt4o: VersionListType = {
  id: 'GPT-4o',
  version: 'gpt4o',
  group: 'gpt'
};
export const versionClova: VersionListType = {
  id: 'CLOVA X',
  version: 'clovax',
  group: 'clova'
};

export const versionList: VersionListType[] =
  lang === LANG_KO_KR
    ? [versionClova, versionGpt3, versionGpt4, versionGpt4o]
    : [versionGpt3, versionGpt4, versionGpt4o, versionClova];

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
          // iconSrc={rec.id === selectedRecFunction?.id ? rec.selectedIcon : rec.icon}
          iconSrc={<rec.icon />}
          selected={selectedRecFunction ? selectedRecFunction.id === rec.id : false}
          onClick={() => onClick({ id: rec.id })}>
          {t(`FormList.${rec.id}`)}
        </IconBoxTextButton>
      ))}
    </Grid>
  );
};

export default FormRec;
