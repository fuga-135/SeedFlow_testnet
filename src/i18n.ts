import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// 翻訳ファイルをインポート
import enCommon from './locales/en/common.json';
import jaCommon from './locales/ja/common.json';
import swCommon from './locales/sw/common.json';
import frCommon from './locales/fr/common.json';
import kmCommon from './locales/km/common.json';

// リソースを定義
const resources = {
  en: {
    common: enCommon,
  },
  ja: {
    common: jaCommon,
  },
  sw: {
    common: swCommon,
  },
  fr: {
    common: frCommon,
  },
  km: {
    common: kmCommon,
  }
};

i18n
  // ブラウザの言語を検出
  .use(LanguageDetector)
  // Reactと連携
  .use(initReactI18next)
  // i18nの初期化
  .init({
    resources,
    fallbackLng: 'en', // フォールバック言語
    ns: ['common'], // 使用する名前空間
    defaultNS: 'common', // デフォルトの名前空間
    interpolation: {
      escapeValue: false, // XSS対策（Reactで既に行われているため不要）
    },
    react: {
      useSuspense: true, // Suspenseを使用する
    },
  });

export default i18n; 