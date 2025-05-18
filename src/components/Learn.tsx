import React from 'react';
import { useTranslation } from 'react-i18next';

const Learn: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="space-y-12">
      {/* Learn Hero Section */}
      <section className="text-center py-16 bg-green-50 rounded-lg">
        <h1 className="text-4xl font-bold text-green-600 mb-4">
          {t('learn.hero.title')}
        </h1>
        <p className="text-xl text-gray-700 mb-6 max-w-2xl mx-auto">
          {t('learn.hero.subtitle')}
        </p>
      </section>

      {/* Topics Grid */}
      <section className="grid md:grid-cols-3 gap-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-green-600 mb-4">{t('learn.topics.microfinance.title')}</h3>
          <ul className="space-y-2 text-gray-600">
            <li className="hover:text-green-600"><a href="#">{t('learn.topics.microfinance.links.what')}</a></li>
            <li className="hover:text-green-600"><a href="#">{t('learn.topics.microfinance.links.how')}</a></li>
            <li className="hover:text-green-600"><a href="#">{t('learn.topics.microfinance.links.repayment')}</a></li>
            <li className="hover:text-green-600"><a href="#">{t('learn.topics.microfinance.links.stories')}</a></li>
          </ul>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-green-600 mb-4">{t('learn.topics.insurance.title')}</h3>
          <ul className="space-y-2 text-gray-600">
            <li className="hover:text-green-600"><a href="#">{t('learn.topics.insurance.links.understanding')}</a></li>
            <li className="hover:text-green-600"><a href="#">{t('learn.topics.insurance.links.weather')}</a></li>
            <li className="hover:text-green-600"><a href="#">{t('learn.topics.insurance.links.oracle')}</a></li>
            <li className="hover:text-green-600"><a href="#">{t('learn.topics.insurance.links.climate')}</a></li>
          </ul>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-green-600 mb-4">{t('learn.topics.blockchain.title')}</h3>
          <ul className="space-y-2 text-gray-600">
            <li className="hover:text-green-600"><a href="#">{t('learn.topics.blockchain.links.basics')}</a></li>
            <li className="hover:text-green-600"><a href="#">{t('learn.topics.blockchain.links.solana')}</a></li>
            <li className="hover:text-green-600"><a href="#">{t('learn.topics.blockchain.links.contracts')}</a></li>
            <li className="hover:text-green-600"><a href="#">{t('learn.topics.blockchain.links.inclusion')}</a></li>
          </ul>
        </div>
      </section>

      {/* Featured Resource */}
      <section className="bg-white p-8 rounded-lg shadow-md">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="md:w-2/3">
            <span className="text-green-600 font-medium">{t('learn.featured.tag')}</span>
            <h2 className="text-2xl font-bold mb-4">{t('learn.featured.title')}</h2>
            <p className="text-gray-600 mb-6">
              {t('learn.featured.description')}
            </p>
            <button className="bg-green-600 text-white px-6 py-2 rounded-md font-medium hover:bg-green-700 transition-colors">
              {t('learn.featured.cta')}
            </button>
          </div>
          <div className="md:w-1/3 bg-green-100 rounded-lg p-6">
            <h3 className="font-bold mb-2">{t('learn.featured.resources.title')}</h3>
            <ul className="space-y-2">
              <li className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <a href="#" className="text-green-600 hover:underline">{t('learn.featured.resources.glossary')}</a>
              </li>
              <li className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                <a href="#" className="text-green-600 hover:underline">{t('learn.featured.resources.videos')}</a>
              </li>
              <li className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <a href="#" className="text-green-600 hover:underline">{t('learn.featured.resources.faq')}</a>
              </li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Learn; 