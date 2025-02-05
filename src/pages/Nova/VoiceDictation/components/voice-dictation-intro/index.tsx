import { Guide } from 'components/nova/Guide';
import { NOVA_TAB_TYPE } from 'constants/novaTapTypes';
import { useTranslation } from 'react-i18next';

import AudioFileUploader from '../audio-file-uploader';
import RecognizedLang from '../recognized-lang';

export default function VoiceDictationIntro() {
  const { t } = useTranslation();

  return (
    <Guide>
      <RecognizedLang />
      <AudioFileUploader
        guideMsg={t('Nova.voiceDictation.Guide.UploadGuide')}
        curTab={NOVA_TAB_TYPE.voiceDictation}
        handleUploadComplete={() => console.log('123')}
        creditCount={30}
      />
    </Guide>
  );
}
