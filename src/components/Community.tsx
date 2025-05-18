import React from 'react';
import { useTranslation } from 'react-i18next';

const Community: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="space-y-12">
      {/* Community Hero Section */}
      <section className="text-center py-16 bg-green-50 rounded-lg">
        <h1 className="text-4xl font-bold text-green-600 mb-4">
          {t('community.hero.title')}
        </h1>
        <p className="text-xl text-gray-700 mb-6 max-w-2xl mx-auto">
          {t('community.hero.subtitle')}
        </p>
      </section>

      {/* Community Forums Section */}
      <section className="bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-green-600 mb-6">{t('community.forums.title')}</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="border border-gray-200 rounded-lg p-6">
            <h3 className="font-bold text-lg mb-2">{t('community.forums.farmers.title')}</h3>
            <p className="text-gray-600 mb-4">
              {t('community.forums.farmers.description')}
            </p>
            <a 
              href="#" 
              className="text-green-600 font-medium hover:text-green-800"
            >
              {t('community.forums.farmers.cta')}
            </a>
          </div>
          <div className="border border-gray-200 rounded-lg p-6">
            <h3 className="font-bold text-lg mb-2">{t('community.forums.business.title')}</h3>
            <p className="text-gray-600 mb-4">
              {t('community.forums.business.description')}
            </p>
            <a 
              href="#" 
              className="text-green-600 font-medium hover:text-green-800"
            >
              {t('community.forums.business.cta')}
            </a>
          </div>
        </div>
      </section>

      {/* Events Section */}
      <section className="bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-green-600 mb-6">{t('community.events.title')}</h2>
        <div className="space-y-6">
          <div className="border-l-4 border-green-500 pl-4">
            <p className="text-sm text-green-600 font-medium">{t('community.events.event1.date')}</p>
            <h3 className="font-bold text-lg mb-1">{t('community.events.event1.title')}</h3>
            <p className="text-gray-600">
              {t('community.events.event1.description')}
            </p>
          </div>
          <div className="border-l-4 border-green-500 pl-4">
            <p className="text-sm text-green-600 font-medium">{t('community.events.event2.date')}</p>
            <h3 className="font-bold text-lg mb-1">{t('community.events.event2.title')}</h3>
            <p className="text-gray-600">
              {t('community.events.event2.description')}
            </p>
          </div>
        </div>
      </section>

      {/* Ambassador Program */}
      <section className="bg-gradient-to-r from-green-500 to-green-600 p-8 rounded-lg text-white">
        <h2 className="text-2xl font-bold mb-4">{t('community.ambassador.title')}</h2>
        <p className="mb-6">
          {t('community.ambassador.description')}
        </p>
        <button className="bg-white text-green-600 px-6 py-2 rounded-full font-medium hover:bg-gray-100 transition-colors">
          {t('community.ambassador.cta')}
        </button>
      </section>
    </div>
  );
};

export default Community; 