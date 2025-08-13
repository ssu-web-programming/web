import { SelectedOption } from 'components/aiWrite/ai-write-input';
import { VersionListType } from 'components/chat/RecommendBox/FormRec';

const CREDIT_NAME_MAP: { [key: string]: string } = {
  WRITE_GPT4_1: 'GPT 4.1',
  WRITE_GPT4: 'GPT 4',
  GPT3: 'GPT 3.5',
  WRITE_CLOVA: 'CLOVA X',
  WRITE_CLADE3: 'Claude 3.5 Sonnet',
  WRITE_EXAONE_4_0: 'LG AI Research EXAONE 4.0',
  WRITE_SOLAR_PRO_2: 'Upstage Solar Pro 2',
  WRITE_GPT5: 'GPT 5'
};

const CREDIT_DESCRITION_MAP: { [key: string]: string } = {
  WRITE_GPT4_1: 'WriteTab.ModelSelect.gpt4_1',
  WRITE_GPT4: 'WriteTab.ModelSelect.gpt4',
  GPT3: 'WriteTab.ModelSelect.gpt3.5',
  WRITE_CLOVA: 'WriteTab.ModelSelect.clovax',
  WRITE_CLADE3: 'WriteTab.ModelSelect.claude',
  WRITE_EXAONE_4_0: 'WriteTab.ModelSelect.exaone4',
  WRITE_SOLAR_PRO_2: 'WriteTab.ModelSelect.solarpro2',
  WRITE_GPT5: 'WriteTab.ModelSelect.gpt5'
};

const VERSION_MAP: { [key: string]: string } = {
  WRITE_GPT4_1: 'gpt-4.1',
  WRITE_GPT4: 'gpt4',
  GPT3: 'gpt3.5',
  WRITE_CLOVA: 'clovax',
  WRITE_CLADE3: 'claude'
};

const ENGINE_VERSION_TO_CREDIT: Record<VersionListType['version'], SelectedOption> = {
  'gpt3.5': 'GPT3',
  gpt4: 'WRITE_GPT4',
  'gpt-4.1': 'WRITE_GPT4_1',
  clovax: 'WRITE_CLOVA',
  claude: 'WRITE_CLADE3',
  'exaone-4.0': 'WRITE_EXAONE_4_0',
  'solar-pro-2': 'WRITE_SOLAR_PRO_2',
  gpt5: 'WRITE_GPT5'
};

export { CREDIT_DESCRITION_MAP, CREDIT_NAME_MAP, ENGINE_VERSION_TO_CREDIT, VERSION_MAP };
