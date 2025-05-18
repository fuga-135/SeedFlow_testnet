import React, { useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { Connection, PublicKey } from '@solana/web3.js';
import { useAnchorProgram, initializeLoan, InsuranceConfigParams } from '../utils/anchor';

interface InsuranceConfig {
  minRainMm: string;
  maxRainMm: string;
  coverageCap: string;
  deductibleBps: string;
  premiumSchedule: string;
  measurementPeriodDays: string;
}

interface LoanApplicationForm {
  amount: string;
  purpose: string;
  duration: string;
  insuranceType: string;
  insuranceConfig: InsuranceConfig;
  oracleProviders: string[];
}

const LoanApplication: React.FC = () => {
  const { publicKey, connected } = useWallet();
  const program = useAnchorProgram();

  const [formData, setFormData] = useState<LoanApplicationForm>({
    amount: '',
    purpose: '',
    duration: '',
    insuranceType: '',
    insuranceConfig: {
      minRainMm: '50',
      maxRainMm: '150',
      coverageCap: '100',
      deductibleBps: '500', // 5%
      premiumSchedule: 'monthly',
      measurementPeriodDays: '30'
    },
    oracleProviders: ['pyth']
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAdvancedConfig, setShowAdvancedConfig] = useState(false);
  const [premiumEstimate, setPremiumEstimate] = useState<number | null>(null);

  // 保険料の計算
  useEffect(() => {
    if (formData.amount && formData.insuranceType && formData.insuranceConfig.deductibleBps) {
      const premium = calculatePremium(
        parseFloat(formData.amount),
        formData.insuranceConfig
      );
      setPremiumEstimate(premium);
    } else {
      setPremiumEstimate(null);
    }
  }, [formData.amount, formData.insuranceType, formData.insuranceConfig]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      // For nested objects like insuranceConfig.minRainMm
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent as keyof LoanApplicationForm] as object,
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleOracleProviderChange = (provider: string) => {
    setFormData(prev => {
      const providers = [...prev.oracleProviders];
      const index = providers.indexOf(provider);
      
      if (index > -1) {
        providers.splice(index, 1);
      } else {
        providers.push(provider);
      }
      
      return {
        ...prev,
        oracleProviders: providers
      };
    });
  };

  const calculatePremium = (loanAmount: number, config: InsuranceConfig): number => {
    // 簡易的な保険料計算ロジック
    // 実際にはもっと複雑なロジックになる
    const basePremium = loanAmount * 0.05; // 基本保険料は5%
    const deductibleFactor = parseFloat(config.deductibleBps) / 10000; // bpsを割合に変換
    const periodFactor = parseInt(config.measurementPeriodDays) / 30; // 期間による係数
    
    let typeFactor = 1.0;
    if (formData.insuranceType === 'weather') {
      typeFactor = 1.2; // 天候保険は20%増
    } else if (formData.insuranceType === 'crop') {
      typeFactor = 1.5; // 作物保険は50%増
    }
    
    return basePremium * (1 - deductibleFactor) * periodFactor * typeFactor;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!connected || !publicKey || !program) {
      alert('Please connect your wallet first');
      return;
    }

    setIsSubmitting(true);
    try {
      // 保険設定パラメータの変換
      const insuranceConfig: InsuranceConfigParams = {
        insuranceType: formData.insuranceType === 'weather' ? 0 : 
                      formData.insuranceType === 'crop' ? 1 : 2,
        minRainMm: parseInt(formData.insuranceConfig.minRainMm),
        maxRainMm: parseInt(formData.insuranceConfig.maxRainMm),
        coverageCap: parseInt(formData.insuranceConfig.coverageCap) * 1_000_000,
        deductibleBps: parseInt(formData.insuranceConfig.deductibleBps),
        premiumSchedule: formData.insuranceConfig.premiumSchedule === 'monthly' ? 0 : 1,
        measurementPeriodDays: parseInt(formData.insuranceConfig.measurementPeriodDays)
      };

      // ローン申請のトランザクション実行
      const txId = await initializeLoan(
        program,
        publicKey,
        parseFloat(formData.amount) * 1_000_000, // SOLをlambdaに変換
        parseInt(formData.duration) * 30 * 24 * 60 * 60, // 月を秒に変換
        insuranceConfig
      );

      console.log('Loan application submitted successfully:', txId);
      alert('Loan application submitted successfully!');
      
      // フォームをリセット
      setFormData({
        amount: '',
        purpose: '',
        duration: '',
        insuranceType: '',
        insuranceConfig: {
          minRainMm: '50',
          maxRainMm: '150',
          coverageCap: '100',
          deductibleBps: '500',
          premiumSchedule: 'monthly',
          measurementPeriodDays: '30'
        },
        oracleProviders: ['pyth']
      });
      
    } catch (error) {
      console.error('Error submitting loan application:', error);
      alert('Error submitting loan application. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!connected) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">Connect Your Wallet</h2>
        <p className="text-gray-600 mb-6">Please connect your Solana wallet to apply for a loan.</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <h2 className="text-3xl font-bold mb-8">Apply for a Loan</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
              Loan Amount (SOL)
            </label>
            <input
              type="number"
              id="amount"
              name="amount"
              value={formData.amount}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
              required
              min="0.1"
              step="0.1"
            />
          </div>

          <div>
            <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-1">
              Loan Duration
            </label>
            <select
              id="duration"
              name="duration"
              value={formData.duration}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
              required
            >
              <option value="">Select duration</option>
              <option value="3">3 months</option>
              <option value="6">6 months</option>
              <option value="12">12 months</option>
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="purpose" className="block text-sm font-medium text-gray-700 mb-1">
            Purpose of Loan
          </label>
          <textarea
            id="purpose"
            name="purpose"
            value={formData.purpose}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
            required
            rows={3}
          />
        </div>

        <div>
          <label htmlFor="insuranceType" className="block text-sm font-medium text-gray-700 mb-1">
            Insurance Type
          </label>
          <select
            id="insuranceType"
            name="insuranceType"
            value={formData.insuranceType}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
            required
          >
            <option value="">Select insurance type</option>
            <option value="weather">Weather Insurance</option>
            <option value="crop">Crop Insurance</option>
            <option value="business">Business Insurance</option>
          </select>
        </div>

        <div className="flex items-center justify-between border-t pt-4">
          <button
            type="button"
            onClick={() => setShowAdvancedConfig(!showAdvancedConfig)}
            className="text-green-600 hover:text-green-800 text-sm font-medium flex items-center"
          >
            {showAdvancedConfig ? 'Hide' : 'Show'} Advanced Insurance Configuration
            <svg className="w-4 h-4 ml-1" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d={showAdvancedConfig ? "M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" : "M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"}
                clipRule="evenodd"
              />
            </svg>
          </button>
          {premiumEstimate !== null && (
            <div className="text-right">
              <span className="text-sm text-gray-600">Estimated Premium:</span>
              <span className="ml-2 font-bold text-green-600">{premiumEstimate.toFixed(3)} SOL</span>
            </div>
          )}
        </div>

        {showAdvancedConfig && (
          <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
            <h3 className="text-lg font-medium mb-4">Advanced Insurance Settings</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {formData.insuranceType === 'weather' && (
                <>
                  <div>
                    <label htmlFor="insuranceConfig.minRainMm" className="block text-sm font-medium text-gray-700 mb-1">
                      Minimum Rainfall (mm)
                    </label>
                    <input
                      type="number"
                      id="insuranceConfig.minRainMm"
                      name="insuranceConfig.minRainMm"
                      value={formData.insuranceConfig.minRainMm}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Insurance triggers if rainfall is below this threshold
                    </p>
                  </div>
                  
                  <div>
                    <label htmlFor="insuranceConfig.maxRainMm" className="block text-sm font-medium text-gray-700 mb-1">
                      Maximum Rainfall (mm)
                    </label>
                    <input
                      type="number"
                      id="insuranceConfig.maxRainMm"
                      name="insuranceConfig.maxRainMm"
                      value={formData.insuranceConfig.maxRainMm}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Insurance triggers if rainfall exceeds this threshold
                    </p>
                  </div>
                </>
              )}
              
              <div>
                <label htmlFor="insuranceConfig.coverageCap" className="block text-sm font-medium text-gray-700 mb-1">
                  Coverage Cap (SOL)
                </label>
                <input
                  type="number"
                  id="insuranceConfig.coverageCap"
                  name="insuranceConfig.coverageCap"
                  value={formData.insuranceConfig.coverageCap}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Maximum payout amount
                </p>
              </div>
              
              <div>
                <label htmlFor="insuranceConfig.deductibleBps" className="block text-sm font-medium text-gray-700 mb-1">
                  Deductible (basis points)
                </label>
                <input
                  type="number"
                  id="insuranceConfig.deductibleBps"
                  name="insuranceConfig.deductibleBps"
                  value={formData.insuranceConfig.deductibleBps}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                />
                <p className="text-xs text-gray-500 mt-1">
                  100 bps = 1%, lower deductible means higher premium
                </p>
              </div>
              
              <div>
                <label htmlFor="insuranceConfig.premiumSchedule" className="block text-sm font-medium text-gray-700 mb-1">
                  Premium Payment Schedule
                </label>
                <select
                  id="insuranceConfig.premiumSchedule"
                  name="insuranceConfig.premiumSchedule"
                  value={formData.insuranceConfig.premiumSchedule}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                >
                  <option value="monthly">Monthly</option>
                  <option value="lumpsum">Lump Sum</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="insuranceConfig.measurementPeriodDays" className="block text-sm font-medium text-gray-700 mb-1">
                  Measurement Period (days)
                </label>
                <input
                  type="number"
                  id="insuranceConfig.measurementPeriodDays"
                  name="insuranceConfig.measurementPeriodDays"
                  value={formData.insuranceConfig.measurementPeriodDays}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                />
                <p className="text-xs text-gray-500 mt-1">
                  How often oracle data is checked
                </p>
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Oracle Providers
              </label>
              <div className="flex flex-wrap gap-4">
                {['pyth', 'switchboard', 'chainlink'].map(provider => (
                  <label key={provider} className="inline-flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.oracleProviders.includes(provider)}
                      onChange={() => handleOracleProviderChange(provider)}
                      className="h-4 w-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                    />
                    <span className="ml-2 text-sm text-gray-700 capitalize">{provider}</span>
                  </label>
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Select multiple providers for increased data reliability
              </p>
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-green-600 text-white py-3 px-6 rounded-md font-bold hover:bg-green-700 transition-colors disabled:bg-gray-400"
        >
          {isSubmitting ? 'Processing...' : 'Submit Application'}
        </button>
      </form>
    </div>
  );
};

export default LoanApplication; 