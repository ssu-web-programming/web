import TranslationContent from './components/translation-content';
import { TranslationProvider } from './provider/translation-provider';

export default function Translation() {
  return (
    <TranslationProvider>
      <TranslationContent />
    </TranslationProvider>
  );
}
