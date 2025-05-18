import React, { Suspense, useMemo } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { 
  PhantomWalletAdapter,
  SolflareWalletAdapter,
  TorusWalletAdapter,
  LedgerWalletAdapter,
  CloverWalletAdapter
} from '@solana/wallet-adapter-wallets';
import { clusterApiUrl } from '@solana/web3.js';

// i18nの初期化ファイルをインポート
import './i18n';

// Import components
import Navbar from './components/Navbar';
import Home from './components/Home';
import LoanApplication from './components/LoanApplication';
import Insurance from './components/Insurance';
import Dashboard from './components/Dashboard';
import Community from './components/Community';
import Learn from './components/Learn';
import WalletTest from './components/WalletTest';

// Import styles
import './App.css';
// Required for wallet adapter
import '@solana/wallet-adapter-react-ui/styles.css';

// ローディングコンポーネント
const Loading = () => (
  <div className="flex justify-center items-center h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
  </div>
);

function App() {
  // Solana network configuration
  const endpoint = process.env.REACT_APP_SOLANA_RPC_URL || clusterApiUrl('devnet');
  
  // ウォレットアダプターを設定
  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      new SolflareWalletAdapter(),
      new TorusWalletAdapter(),
      new LedgerWalletAdapter(),
      new CloverWalletAdapter()
    ],
    []
  );

  // セキュリティ設定
  const walletConnectionConfig = {
    autoConnect: false, // 自動接続を無効化
    onError: (error: any) => {
      console.error('Wallet connection error:', error);
      // エラー処理を追加
    }
  };

  return (
    <Suspense fallback={<Loading />}>
      <ConnectionProvider endpoint={endpoint}>
        <WalletProvider wallets={wallets} {...walletConnectionConfig}>
          <WalletModalProvider>
            <Router>
              <div className="min-h-screen bg-gray-100">
                <Navbar />
                <main className="container mx-auto px-4 py-8">
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/apply" element={<LoanApplication />} />
                    <Route path="/insurance" element={<Insurance />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/community" element={<Community />} />
                    <Route path="/learn" element={<Learn />} />
                    <Route path="/wallet-test" element={<WalletTest />} />
                  </Routes>
                </main>
              </div>
            </Router>
          </WalletModalProvider>
        </WalletProvider>
      </ConnectionProvider>
    </Suspense>
  );
}

export default App; 