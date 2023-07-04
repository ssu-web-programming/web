import Grid from '../../layout/Grid';
import icon_sentence from '../../../img/aiChat/ico_sentence.svg';
import icon_table from '../../../img/aiChat/ico_table.svg';
import icon_list from '../../../img/aiChat/ico_table_of_contents.svg';
import icon_sentence_purple from '../../../img/aiChat/ico_sentence_purple.svg';
import icon_table_purple from '../../../img/aiChat/ico_table_purple.svg';
import icon_list_purple from '../../../img/aiChat/ico_table_of_contents_purple.svg';
import IconBoxTextButton from '../../buttons/IconBoxTextButton';
import { useTranslation } from 'react-i18next';
import { recSubType, recType } from '../../../store/slices/recFuncSlice';

interface FormListType {
  id: string;
  icon: string;
  selectedIcon: string;
}

interface LengthListType {
  id: string;
  length: string;
}

export interface WriteOptions {
  input: string;
  form: FormListType;
  length: LengthListType;
}

export const DEFAULT_WRITE_OPTION_FORM_VALUE: FormListType = {
  id: 'paragraph',
  icon: icon_sentence,
  selectedIcon: icon_sentence_purple
};

export const formRecList = [
  DEFAULT_WRITE_OPTION_FORM_VALUE,
  { id: 'list', icon: icon_list, selectedIcon: icon_list_purple },
  {
    id: 'table',
    icon: icon_table,
    selectedIcon: icon_table_purple
  }
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
          iconSrc={rec.id === selectedRecFunction?.id ? rec.selectedIcon : rec.icon}
          selected={selectedRecFunction ? selectedRecFunction.id === rec.id : false}
          onClick={() => onClick({ id: rec.id })}>
          {t(`FormList.${rec.id}`)}
        </IconBoxTextButton>
      ))}
    </Grid>
  );
};

export default FormRec;
