import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Home: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="text-center py-12 md:py-20 bg-gradient-to-r from-green-400 to-green-600 rounded-lg px-4 md:px-8">
        <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold text-white mb-4 md:mb-6 leading-tight">
          {t('home.hero.title')}
        </h1>
        <p className="text-lg md:text-xl text-white mb-6 md:mb-8 max-w-2xl mx-auto">
          {t('home.hero.subtitle')}
        </p>
        <Link
          to="/apply"
          className="inline-block bg-white text-green-600 px-6 sm:px-8 py-2 sm:py-3 rounded-full font-bold hover:bg-gray-100 transition-colors"
        >
          {t('home.hero.cta')}
        </Link>
      </section>

      {/* Features Section */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 px-4 md:px-0">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg md:text-xl font-bold text-green-600 mb-3 md:mb-4">
            {t('home.features.loans.title')}
          </h3>
          <p className="text-gray-600">
            {t('home.features.loans.description')}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg md:text-xl font-bold text-green-600 mb-3 md:mb-4">
            {t('home.features.insurance.title')}
          </h3>
          <p className="text-gray-600">
            {t('home.features.insurance.description')}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg md:text-xl font-bold text-green-600 mb-3 md:mb-4">
            {t('home.features.security.title')}
          </h3>
          <p className="text-gray-600">
            {t('home.features.security.description')}
          </p>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="bg-white p-6 md:p-8 rounded-lg shadow-md">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-6 md:mb-8">
          {t('home.howItWorks.title')}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-green-600 font-bold">1</span>
            </div>
            <h3 className="font-bold mb-2">
              {t('home.howItWorks.step1.title')}
            </h3>
            <p className="text-gray-600">
              {t('home.howItWorks.step1.description')}
            </p>
          </div>
          <div className="text-center">
            <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-green-600 font-bold">2</span>
            </div>
            <h3 className="font-bold mb-2">
              {t('home.howItWorks.step2.title')}
            </h3>
            <p className="text-gray-600">
              {t('home.howItWorks.step2.description')}
            </p>
          </div>
          <div className="text-center">
            <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-green-600 font-bold">3</span>
            </div>
            <h3 className="font-bold mb-2">
              {t('home.howItWorks.step3.title')}
            </h3>
            <p className="text-gray-600">
              {t('home.howItWorks.step3.description')}
            </p>
          </div>
          <div className="text-center">
            <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-green-600 font-bold">4</span>
            </div>
            <h3 className="font-bold mb-2">
              {t('home.howItWorks.step4.title')}
            </h3>
            <p className="text-gray-600">
              {t('home.howItWorks.step4.description')}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home; 