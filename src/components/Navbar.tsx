import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useTranslation } from 'react-i18next';

const Navbar: React.FC = () => {
  const { connected } = useWallet();
  const { t, i18n } = useTranslation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // 言語切り替えハンドラー
  const changeLanguage = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const language = event.target.value;
    i18n.changeLanguage(language);
  };

  // メニューを閉じる
  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <nav className="bg-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center" onClick={closeMenu}>
              <div className="flex flex-col items-center mr-4">
                <img 
                  src="/images/seedflow-logo.svg" 
                  alt="SeedFlow" 
                  className="h-12 w-12" 
                />
                <div className="flex flex-col items-center">
                  <span className="text-lg font-bold text-blue-900">SeedFlow</span>
                  <span className="text-xs text-blue-900 tracking-wider">GROWING PROSPERITY</span>
                </div>
              </div>
              <span className="text-xs bg-green-100 text-green-800 py-1 px-2 rounded-full">Beta</span>
            </Link>
            
            {/* デスクトップメニュー */}
            <div className="hidden md:block ml-10">
              <div className="flex items-baseline space-x-4">
                <Link
                  to="/"
                  className="text-gray-700 hover:text-green-600 px-3 py-2 rounded-md text-sm font-medium"
                >
                  {t('navbar.home')}
                </Link>
                <Link
                  to="/apply"
                  className="text-gray-700 hover:text-green-600 px-3 py-2 rounded-md text-sm font-medium"
                >
                  {t('navbar.getFinancing')}
                </Link>
                <Link
                  to="/insurance"
                  className="text-gray-700 hover:text-green-600 px-3 py-2 rounded-md text-sm font-medium"
                >
                  {t('navbar.insurance')}
                </Link>
                <Link
                  to="/community"
                  className="text-gray-700 hover:text-green-600 px-3 py-2 rounded-md text-sm font-medium"
                >
                  {t('navbar.community')}
                </Link>
                <Link
                  to="/learn"
                  className="text-gray-700 hover:text-green-600 px-3 py-2 rounded-md text-sm font-medium"
                >
                  {t('navbar.learn')}
                </Link>
                <Link
                  to="/wallet-test"
                  className="text-gray-700 hover:text-green-600 px-3 py-2 rounded-md text-sm font-medium"
                >
                  {t('wallet.test')}
                </Link>
                {connected && (
                  <Link
                    to="/dashboard"
                    className="text-gray-700 hover:text-green-600 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    {t('navbar.dashboard')}
                  </Link>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* 言語選択 */}
            <select 
              className="bg-gray-50 border border-gray-300 text-gray-700 text-sm rounded-md px-2 py-1 focus:outline-none focus:ring-green-500 focus:border-green-500"
              onChange={changeLanguage}
              value={i18n.language}
            >
              <option value="en">{t('languages.en')}</option>
              <option value="ja">{t('languages.ja')}</option>
              <option value="sw">{t('languages.sw')}</option>
              <option value="fr">{t('languages.fr')}</option>
              <option value="km">{t('languages.km')}</option>
            </select>
            
            {/* Walletボタン（モバイルでも表示） */}
            <div className="hidden sm:block">
              <WalletMultiButton className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded" />
            </div>
            
            {/* モバイルメニューボタン */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-700 hover:text-green-600 focus:outline-none"
              >
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  {isMenuOpen ? (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  ) : (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>
        
        {/* モバイルメニュー */}
        {isMenuOpen && (
          <div className="md:hidden pt-2 pb-4 border-t border-gray-200">
            <div className="flex flex-col space-y-2">
              <Link
                to="/"
                className="text-gray-700 hover:text-green-600 px-3 py-2 rounded-md text-sm font-medium"
                onClick={closeMenu}
              >
                {t('navbar.home')}
              </Link>
              <Link
                to="/apply"
                className="text-gray-700 hover:text-green-600 px-3 py-2 rounded-md text-sm font-medium"
                onClick={closeMenu}
              >
                {t('navbar.getFinancing')}
              </Link>
              <Link
                to="/insurance"
                className="text-gray-700 hover:text-green-600 px-3 py-2 rounded-md text-sm font-medium"
                onClick={closeMenu}
              >
                {t('navbar.insurance')}
              </Link>
              <Link
                to="/community"
                className="text-gray-700 hover:text-green-600 px-3 py-2 rounded-md text-sm font-medium"
                onClick={closeMenu}
              >
                {t('navbar.community')}
              </Link>
              <Link
                to="/learn"
                className="text-gray-700 hover:text-green-600 px-3 py-2 rounded-md text-sm font-medium"
                onClick={closeMenu}
              >
                {t('navbar.learn')}
              </Link>
              <Link
                to="/wallet-test"
                className="text-gray-700 hover:text-green-600 px-3 py-2 rounded-md text-sm font-medium"
                onClick={closeMenu}
              >
                {t('wallet.test')}
              </Link>
              {connected && (
                <Link
                  to="/dashboard"
                  className="text-gray-700 hover:text-green-600 px-3 py-2 rounded-md text-sm font-medium"
                  onClick={closeMenu}
                >
                  {t('navbar.dashboard')}
                </Link>
              )}
              {/* モバイルでのWalletボタン */}
              <div className="sm:hidden py-2">
                <WalletMultiButton className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded w-full" />
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar; 