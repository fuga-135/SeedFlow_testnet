import React, { useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';
import { useAnchorProgram, findLoanAccount } from '../utils/anchor';

// ローン情報の型定義
interface Loan {
  id: string;
  amount: number;
  status: 'active' | 'paid' | 'defaulted' | 'insuranceClaimed';
  startDate: Date;
  endDate: Date;
  insuranceType: string;
  insuranceConfig: {
    minRainMm: number;
    maxRainMm: number;
    coverageCap: number;
    deductibleBps: number;
    premiumSchedule: string;
    measurementPeriodDays: number;
  };
}

// オラクルデータの型定義
interface OracleData {
  provider: string;
  timestamp: Date;
  rainAmountMm: number;
  weatherCondition: string;
}

const Dashboard: React.FC = () => {
  const { publicKey, connected } = useWallet();
  const program = useAnchorProgram();
  
  const [loans, setLoans] = useState<Loan[]>([]);
  const [oracleData, setOracleData] = useState<OracleData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedLoan, setSelectedLoan] = useState<string | null>(null);
  const [isRepaying, setIsRepaying] = useState(false);
  const [repayAmount, setRepayAmount] = useState('');

  // ローンデータの取得
  useEffect(() => {
    const fetchLoans = async () => {
      if (!connected || !publicKey || !program) return;

      setIsLoading(true);
      try {
        // プログラムからユーザーのローン情報を取得
        // 実際の実装ではプログラムからのデータフェッチを行う
        
        // 開発用モックデータ
        const mockLoans: Loan[] = [
          {
            id: 'loan1',
            amount: 5,
            status: 'active',
            startDate: new Date('2024-01-01'),
            endDate: new Date('2024-07-01'),
            insuranceType: 'weather',
            insuranceConfig: {
              minRainMm: 50,
              maxRainMm: 150,
              coverageCap: 5,
              deductibleBps: 500,
              premiumSchedule: 'monthly',
              measurementPeriodDays: 30
            }
          },
          {
            id: 'loan2',
            amount: 2.5,
            status: 'active',
            startDate: new Date('2024-02-15'),
            endDate: new Date('2024-08-15'),
            insuranceType: 'crop',
            insuranceConfig: {
              minRainMm: 60,
              maxRainMm: 200,
              coverageCap: 2.5,
              deductibleBps: 300,
              premiumSchedule: 'lumpsum',
              measurementPeriodDays: 45
            }
          }
        ];
        
        setLoans(mockLoans);
        
        // オラクルデータも取得
        const mockOracleData: OracleData[] = [
          {
            provider: 'pyth',
            timestamp: new Date(Date.now() - 86400000), // 1日前
            rainAmountMm: 55,
            weatherCondition: 'normal'
          },
          {
            provider: 'switchboard',
            timestamp: new Date(Date.now() - 86400000 * 2), // 2日前
            rainAmountMm: 52,
            weatherCondition: 'normal'
          },
          {
            provider: 'chainlink',
            timestamp: new Date(Date.now() - 86400000 * 3), // 3日前
            rainAmountMm: 48,
            weatherCondition: 'adverse'
          }
        ];
        
        setOracleData(mockOracleData);
        
      } catch (error) {
        console.error('Error fetching loans:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLoans();
  }, [connected, publicKey, program]);

  // ローン返済処理
  const handleRepay = async (loanId: string) => {
    if (!connected || !publicKey || !program) {
      alert('Please connect your wallet first');
      return;
    }

    try {
      setIsRepaying(true);
      
      // 返済金額を取得
      const amount = parseFloat(repayAmount);
      if (isNaN(amount) || amount <= 0) {
        alert('Please enter a valid amount');
        setIsRepaying(false);
        return;
      }
      
      // ローン返済トランザクションを実行
      console.log(`Repaying loan ${loanId} with amount ${amount} SOL`);
      
      // トランザクション成功後、ローン一覧を更新
      setLoans(prev => 
        prev.map(loan => 
          loan.id === loanId 
            ? { ...loan, status: amount >= loan.amount ? 'paid' : 'active' } 
            : loan
        )
      );
      
      setRepayAmount('');
      setSelectedLoan(null);
      
    } catch (error) {
      console.error('Error repaying loan:', error);
      alert('Error repaying loan. Please try again.');
    } finally {
      setIsRepaying(false);
    }
  };

  if (!connected) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">Connect Your Wallet</h2>
        <p className="text-gray-600 mb-6">Please connect your Solana wallet to view your dashboard.</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="flex justify-center mb-4">
          <div className="animate-spin rounded-full h-10 w-10 border-4 border-green-500 border-t-transparent"></div>
        </div>
        <p className="text-gray-600">Loading your dashboard...</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto">
      <h2 className="text-3xl font-bold mb-8">Your Dashboard</h2>

      {/* 概要セクション */}
      <section className="mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <p className="text-sm text-gray-600">Active Loans</p>
              <p className="text-3xl font-bold text-green-600">{loans.filter(l => l.status === 'active').length}</p>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-gray-600">Total Borrowed</p>
              <p className="text-3xl font-bold text-blue-600">
                {loans.reduce((sum, loan) => sum + loan.amount, 0).toFixed(2)} SOL
              </p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <p className="text-sm text-gray-600">Insurance Coverage</p>
              <p className="text-3xl font-bold text-purple-600">
                {loans
                  .filter(l => l.status === 'active')
                  .reduce((sum, loan) => sum + loan.insuranceConfig.coverageCap, 0)
                  .toFixed(2)} SOL
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ローン一覧セクション */}
      <section className="mb-12">
        <h3 className="text-xl font-bold mb-4">Your Loans</h3>
        {loans.length === 0 ? (
          <p className="text-gray-600">You don't have any loans yet.</p>
        ) : (
          <div className="space-y-4">
            {loans.map((loan) => (
              <div key={loan.id} className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4">
                  <div>
                    <h4 className="font-bold text-lg">Loan #{loan.id.slice(-4)}</h4>
                    <p className="text-sm text-gray-500">
                      {loan.startDate.toLocaleDateString()} - {loan.endDate.toLocaleDateString()}
                    </p>
                  </div>
                  <div className="mt-2 md:mt-0">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold
                      ${loan.status === 'active' ? 'bg-green-100 text-green-800' :
                      loan.status === 'paid' ? 'bg-blue-100 text-blue-800' :
                      loan.status === 'insuranceClaimed' ? 'bg-purple-100 text-purple-800' :
                      'bg-red-100 text-red-800'}`}>
                      {loan.status.charAt(0).toUpperCase() + loan.status.slice(1)}
                    </span>
                  </div>
                </div>
                
                <div className="grid md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-600">Loan Amount</p>
                    <p className="text-lg font-bold">{loan.amount} SOL</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Insurance Type</p>
                    <p className="text-lg font-bold capitalize">{loan.insuranceType}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Coverage Cap</p>
                    <p className="text-lg font-bold">{loan.insuranceConfig.coverageCap} SOL</p>
                  </div>
                </div>
                
                {/* 返済セクション */}
                {loan.status === 'active' && (
                  <div className="mt-4 pt-4 border-t">
                    {selectedLoan === loan.id ? (
                      <div className="flex flex-col md:flex-row gap-2">
                        <input
                          type="number"
                          value={repayAmount}
                          onChange={(e) => setRepayAmount(e.target.value)}
                          placeholder="Amount to repay (SOL)"
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
                          min="0.01"
                          step="0.01"
                        />
                        <button
                          onClick={() => handleRepay(loan.id)}
                          disabled={isRepaying}
                          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-400"
                        >
                          {isRepaying ? 'Processing...' : 'Confirm'}
                        </button>
                        <button
                          onClick={() => {
                            setSelectedLoan(null);
                            setRepayAmount('');
                          }}
                          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setSelectedLoan(loan.id)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                      >
                        Repay Loan
                      </button>
                    )}
                  </div>
                )}
                
                {/* 詳細ボタン */}
                <div className="mt-4 text-right">
                  <button
                    onClick={() => alert(`View details for loan ${loan.id}`)}
                    className="text-blue-600 hover:text-blue-800 text-sm"
                  >
                    View Details →
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* オラクルデータセクション */}
      <section className="mb-12">
        <h3 className="text-xl font-bold mb-4">Oracle Data</h3>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Provider</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rainfall (mm)</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Condition</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {oracleData.map((data, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap capitalize">{data.provider}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{data.timestamp.toLocaleDateString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{data.rainAmountMm}</td>
                    <td className="px-6 py-4 whitespace-nowrap capitalize">{data.weatherCondition}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* 保険請求セクション */}
      <section>
        <h3 className="text-xl font-bold mb-4">Insurance Claims</h3>
        {loans.filter(loan => loan.status === 'active').length === 0 ? (
          <p className="text-gray-600">You have no active insurance policies.</p>
        ) : (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <p className="mb-4">
              Your insurance policies are automatically monitored by our system.
              Claims will be processed automatically when trigger conditions are met.
            </p>
            
            <div className="grid md:grid-cols-2 gap-6">
              {loans
                .filter(loan => loan.status === 'active')
                .map(loan => (
                  <div key={loan.id} className="border p-4 rounded-md">
                    <h4 className="font-bold mb-2 capitalize">{loan.insuranceType} Insurance (Loan #{loan.id.slice(-4)})</h4>
                    <div className="text-sm">
                      <p className="flex justify-between py-1">
                        <span className="text-gray-600">Coverage:</span>
                        <span>{loan.insuranceConfig.coverageCap} SOL</span>
                      </p>
                      <p className="flex justify-between py-1">
                        <span className="text-gray-600">Deductible:</span>
                        <span>{loan.insuranceConfig.deductibleBps / 100}%</span>
                      </p>
                      {loan.insuranceType === 'weather' && (
                        <>
                          <p className="flex justify-between py-1">
                            <span className="text-gray-600">Min Rainfall:</span>
                            <span>{loan.insuranceConfig.minRainMm} mm</span>
                          </p>
                          <p className="flex justify-between py-1">
                            <span className="text-gray-600">Max Rainfall:</span>
                            <span>{loan.insuranceConfig.maxRainMm} mm</span>
                          </p>
                        </>
                      )}
                      <p className="flex justify-between py-1">
                        <span className="text-gray-600">Check Period:</span>
                        <span>Every {loan.insuranceConfig.measurementPeriodDays} days</span>
                      </p>
                    </div>
                    
                    <div className="mt-4 pt-4 border-t">
                      <p className="text-sm text-gray-600">Status</p>
                      <div className="flex items-center mt-1">
                        <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                        <span>Active Monitoring</span>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}
      </section>
    </div>
  );
};

export default Dashboard; 