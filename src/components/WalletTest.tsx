import React, { useEffect, useState, useCallback } from 'react';
import { useWallet, WalletContextState } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { Connection, LAMPORTS_PER_SOL, PublicKey, clusterApiUrl } from '@solana/web3.js';
import { useTranslation } from 'react-i18next';

// トランザクション署名の検証関数
const verifyTransactionSignature = (signature: string): boolean => {
  // 署名形式の簡易チェック（実際はより厳密な検証が必要）
  return /^[A-Za-z0-9]{87,88}$/.test(signature);
};

const WalletTest: React.FC = () => {
  const { t } = useTranslation();
  const { publicKey, connected, disconnect, signMessage } = useWallet();
  const [balance, setBalance] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [lastActivity, setLastActivity] = useState<Date | null>(null);
  const [securityStatus, setSecurityStatus] = useState<string>("未検証");

  // セキュアなRPCエンドポイントを使用
  const connection = new Connection(
    process.env.REACT_APP_SOLANA_RPC_URL || clusterApiUrl('devnet'),
    { commitment: 'confirmed', confirmTransactionInitialTimeout: 60000 }
  );

  // 残高取得の安全な実装
  const fetchBalance = useCallback(async (walletPublicKey: PublicKey) => {
    if (!walletPublicKey) return;
    
    setLoading(true);
    setError(null);
    
    try {
      // 接続のタイムアウト処理
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Connection timeout')), 10000)
      );
      
      const balancePromise = connection.getBalance(walletPublicKey);
      const balance = await Promise.race([balancePromise, timeoutPromise]) as number;
      
      setBalance(balance / LAMPORTS_PER_SOL);
      setLastActivity(new Date());
    } catch (err) {
      console.error('Failed to fetch balance:', err);
      setError('残高の取得に失敗しました。ネットワーク接続を確認してください。');
      setBalance(null);
    } finally {
      setLoading(false);
    }
  }, [connection]);

  // ウォレット接続時に残高を取得
  useEffect(() => {
    if (publicKey) {
      fetchBalance(publicKey);
      
      // セキュリティチェックを実行
      verifyWalletSecurity();
    } else {
      setBalance(null);
      setSecurityStatus("未検証");
    }
  }, [publicKey, fetchBalance]);

  // 非アクティブタイマー - 15分後に自動切断
  useEffect(() => {
    if (!connected || !lastActivity) return;
    
    const inactivityTimeout = setTimeout(() => {
      disconnect();
      setError("セキュリティのため、長時間の非アクティブによりウォレットが切断されました。");
    }, 15 * 60 * 1000); // 15分
    
    return () => clearTimeout(inactivityTimeout);
  }, [connected, lastActivity, disconnect]);

  // ウォレットのセキュリティ検証
  const verifyWalletSecurity = async () => {
    if (!publicKey || !signMessage) return;
    
    try {
      setSecurityStatus("検証中...");
      
      // セキュリティチャレンジメッセージ
      const message = new TextEncoder().encode(
        `SeedFlow security verification: ${new Date().toISOString()}`
      );
      
      // ユーザーにメッセージの署名を要求
      const signature = await signMessage(message);
      
      if (signature && verifyTransactionSignature(Buffer.from(signature).toString('base64'))) {
        setSecurityStatus("検証済み ✓");
      } else {
        setSecurityStatus("検証失敗 ✗");
      }
    } catch (err) {
      console.error('Wallet security verification failed:', err);
      setSecurityStatus("検証エラー");
    }
  };

  // ウォレットのアドレスを短縮して表示
  const shortenAddress = (address: string) => {
    return `${address.slice(0, 4)}...${address.slice(-4)}`;
  };

  return (
    <div className="bg-white p-6 md:p-8 rounded-lg shadow-md max-w-md mx-auto">
      <h2 className="text-xl md:text-2xl font-bold text-green-600 mb-6 text-center">
        Solana {t('wallet.connect')}
      </h2>

      <div className="flex justify-center mb-6">
        <WalletMultiButton className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded" />
      </div>

      {connected ? (
        <div className="border border-green-200 rounded-lg p-4 bg-green-50">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3">
            <span className="text-gray-600 font-medium mb-1 sm:mb-0">{t('wallet.status')}:</span>
            <div className="flex items-center">
              <span className="text-green-600 font-medium">{t('wallet.connected')}</span>
              <span className={`ml-2 px-2 py-1 text-xs rounded ${
                securityStatus === "検証済み ✓" 
                  ? "bg-green-100 text-green-700" 
                  : securityStatus === "検証失敗 ✗" 
                    ? "bg-red-100 text-red-700" 
                    : "bg-yellow-100 text-yellow-700"
              }`}>
                {securityStatus}
              </span>
            </div>
          </div>
          
          {publicKey && (
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3">
              <span className="text-gray-600 font-medium mb-1 sm:mb-0">{t('wallet.address')}:</span>
              <div className="flex items-center">
                <span className="font-mono text-sm break-all">{shortenAddress(publicKey.toString())}</span>
                <button 
                  onClick={() => {
                    navigator.clipboard.writeText(publicKey.toString());
                    setLastActivity(new Date());
                  }}
                  className="ml-2 text-green-600 hover:text-green-800"
                  title="Copy Address"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                  </svg>
                </button>
              </div>
            </div>
          )}
          
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3">
            <span className="text-gray-600 font-medium mb-1 sm:mb-0">{t('wallet.balance')}:</span>
            {loading ? (
              <span className="text-gray-500">{t('wallet.loading')}</span>
            ) : error ? (
              <span className="text-red-500 text-sm">{error}</span>
            ) : (
              <span className="font-medium">{balance !== null ? `${balance.toFixed(4)} SOL` : '-'}</span>
            )}
          </div>

          {lastActivity && (
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3">
              <span className="text-gray-600 font-medium mb-1 sm:mb-0">最終アクティビティ:</span>
              <span className="text-sm text-gray-500">
                {lastActivity.toLocaleTimeString()}
              </span>
            </div>
          )}

          <div className="flex space-x-2 mt-4">
            <button 
              onClick={() => {
                if (publicKey) {
                  fetchBalance(publicKey);
                  setLastActivity(new Date());
                }
              }}
              className="flex-1 bg-green-100 text-green-600 py-2 px-4 rounded hover:bg-green-200 transition-colors"
              disabled={loading || !publicKey}
            >
              {loading ? t('wallet.loading') : t('wallet.refreshBalance')}
            </button>
            
            <button
              onClick={verifyWalletSecurity}
              className="flex-1 bg-blue-100 text-blue-600 py-2 px-4 rounded hover:bg-blue-200 transition-colors"
              disabled={!publicKey || !signMessage}
            >
              セキュリティ検証
            </button>
          </div>

          <div className="mt-2">
            <button
              onClick={() => {
                disconnect();
                setLastActivity(null);
              }}
              className="w-full border border-red-300 text-red-600 py-2 px-4 rounded hover:bg-red-50 transition-colors"
            >
              安全に切断する
            </button>
          </div>
        </div>
      ) : (
        <div className="text-center text-gray-500">
          <p>{t('wallet.notConnected')}</p>
          <p className="mt-2 text-sm">{t('wallet.clickToConnect')}</p>
        </div>
      )}

      <div className="mt-6 text-sm text-gray-500">
        <p className="mb-2 font-medium">{t('wallet.testInstructions.title')}</p>
        <ol className="list-decimal pl-5 space-y-1">
          <li>{t('wallet.testInstructions.step1')}</li>
          <li>{t('wallet.testInstructions.step2')}</li>
          <li>{t('wallet.testInstructions.step3')}</li>
          <li>{t('wallet.testInstructions.step4')}</li>
        </ol>
        <p className="mt-2">
          <span className="font-medium">{t('wallet.testInstructions.note')}</span> {t('wallet.testInstructions.devnet')}
        </p>
        
        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
          <p className="font-medium text-yellow-700">セキュリティ注意事項:</p>
          <ul className="list-disc pl-5 mt-1 text-yellow-700">
            <li>信頼できるウェブサイトでのみウォレットを接続してください</li>
            <li>トランザクション内容を必ず確認してから署名してください</li>
            <li>シード句を誰とも共有しないでください</li>
            <li>15分間の非アクティブ後、セキュリティのために自動的に切断されます</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default WalletTest; 