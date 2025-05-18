import React, { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';

interface InsuranceOption {
  id: string;
  title: string;
  description: string;
  coverage: string;
  trigger: string;
  providers: string[];
  detailsImg: string;
}

interface OracleProvider {
  id: string;
  name: string;
  description: string;
  reliability: number;
  updateFrequency: string;
  dataTypes: string[];
}

const insuranceOptions: InsuranceOption[] = [
  {
    id: 'weather',
    title: 'Weather Insurance',
    description: 'Protection against adverse weather conditions affecting your crops or business.',
    coverage: 'Up to 80% of loan amount',
    trigger: 'Weather data from verified oracles',
    providers: ['pyth', 'switchboard', 'chainlink'],
    detailsImg: 'https://via.placeholder.com/500x300?text=Weather+Insurance+Chart'
  },
  {
    id: 'crop',
    title: 'Crop Insurance',
    description: 'Coverage for crop failure due to natural disasters or disease.',
    coverage: 'Up to 90% of loan amount',
    trigger: 'Crop yield data and disease reports',
    providers: ['pyth', 'chainlink'],
    detailsImg: 'https://via.placeholder.com/500x300?text=Crop+Insurance+Chart'
  },
  {
    id: 'business',
    title: 'Business Insurance',
    description: 'Protection against business interruption due to unforeseen circumstances.',
    coverage: 'Up to 70% of loan amount',
    trigger: 'Business performance metrics',
    providers: ['switchboard', 'chainlink'],
    detailsImg: 'https://via.placeholder.com/500x300?text=Business+Insurance+Chart'
  },
];

const oracleProviders: OracleProvider[] = [
  {
    id: 'pyth',
    name: 'Pyth Network',
    description: 'High-fidelity price data and financial market data for DeFi applications.',
    reliability: 98,
    updateFrequency: 'Every 15 seconds',
    dataTypes: ['Weather', 'Crop Yields', 'Market Prices']
  },
  {
    id: 'switchboard',
    name: 'Switchboard',
    description: 'Decentralized oracle network providing custom data feeds.',
    reliability: 97,
    updateFrequency: 'Every 10 minutes',
    dataTypes: ['Weather', 'Business Metrics', 'Agricultural Data']
  },
  {
    id: 'chainlink',
    name: 'Chainlink',
    description: 'Widely-used decentralized oracle network with secure data feeds.',
    reliability: 99,
    updateFrequency: 'Every 1 minute',
    dataTypes: ['Weather', 'Crop Yields', 'Business Metrics']
  }
];

const Insurance: React.FC = () => {
  const { connected } = useWallet();
  const [activeTab, setActiveTab] = useState<'options' | 'providers' | 'aggregation'>('options');
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  if (!connected) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">Connect Your Wallet</h2>
        <p className="text-gray-600 mb-6">Please connect your Solana wallet to view insurance options.</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto">
      <h2 className="text-3xl font-bold mb-8">Insurance Coverage</h2>
      
      {/* タブメニュー */}
      <div className="mb-8 border-b">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab('options')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'options'
                ? 'border-green-500 text-green-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Insurance Options
          </button>
          <button
            onClick={() => setActiveTab('providers')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'providers'
                ? 'border-green-500 text-green-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Oracle Providers
          </button>
          <button
            onClick={() => setActiveTab('aggregation')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'aggregation'
                ? 'border-green-500 text-green-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Data Aggregation
          </button>
        </nav>
      </div>

      {/* 保険オプションタブ */}
      {activeTab === 'options' && (
        <div>
          <p className="text-gray-600 mb-8">
            Our parametric insurance options are automatically triggered by verified oracle data,
            ensuring quick and transparent payouts when needed. Each policy can be customized
            with specific parameters to fit your needs.
          </p>

          <div className="grid md:grid-cols-3 gap-6 mb-10">
            {insuranceOptions.map((option) => (
              <div 
                key={option.id} 
                className={`bg-white p-6 rounded-lg shadow-md cursor-pointer transition-all ${
                  selectedOption === option.id ? 'ring-2 ring-green-500' : 'hover:shadow-lg'
                }`}
                onClick={() => setSelectedOption(option.id === selectedOption ? null : option.id)}
              >
                <h3 className="text-xl font-bold text-green-600 mb-4">{option.title}</h3>
                <p className="text-gray-600 mb-4">{option.description}</p>
                <div className="space-y-2">
                  <div>
                    <span className="font-semibold">Coverage:</span>
                    <span className="text-gray-600 ml-2">{option.coverage}</span>
                  </div>
                  <div>
                    <span className="font-semibold">Trigger:</span>
                    <span className="text-gray-600 ml-2">{option.trigger}</span>
                  </div>
                  <div>
                    <span className="font-semibold">Providers:</span>
                    <div className="flex space-x-1 mt-1">
                      {option.providers.map(provider => (
                        <span 
                          key={provider} 
                          className="px-2 py-1 bg-gray-100 text-xs rounded-full capitalize"
                        >
                          {provider}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* 選択した保険オプションの詳細 */}
          {selectedOption && (
            <div className="bg-white p-6 rounded-lg shadow-md mb-10">
              <h3 className="text-xl font-bold text-green-600 mb-4">
                {insuranceOptions.find(opt => opt.id === selectedOption)?.title} Details
              </h3>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-2">Advanced Parameters</h4>
                  {selectedOption === 'weather' && (
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-gray-600">Rainfall Threshold Range</p>
                        <p>Triggers if rainfall is outside the range of <b>50mm - 150mm</b> during measurement period</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Wind Speed Threshold</p>
                        <p>Triggers if sustained wind speeds exceed <b>65 km/h</b> for more than 6 hours</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Temperature Extremes</p>
                        <p>Triggers if temperature is below <b>-5°C</b> or above <b>40°C</b> for more than 48 hours</p>
                      </div>
                    </div>
                  )}
                  
                  {selectedOption === 'crop' && (
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-gray-600">Yield Threshold</p>
                        <p>Triggers if crop yield falls below <b>70%</b> of expected yield</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Disease Impact Measurement</p>
                        <p>Triggers if more than <b>30%</b> of the crop is affected by verified disease outbreak</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Market Price Floor</p>
                        <p>Triggers if market price falls below <b>60%</b> of baseline at harvest time</p>
                      </div>
                    </div>
                  )}
                  
                  {selectedOption === 'business' && (
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-gray-600">Revenue Threshold</p>
                        <p>Triggers if business revenue falls below <b>65%</b> of projected revenue</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Customer Traffic Measurement</p>
                        <p>Triggers if customer traffic falls below <b>50%</b> of baseline for more than 30 days</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Supply Chain Disruption</p>
                        <p>Triggers if key supplies are delayed by more than <b>45 days</b> due to verified disruptions</p>
                      </div>
                    </div>
                  )}
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2">Historical Data & Projections</h4>
                  <img 
                    src={insuranceOptions.find(opt => opt.id === selectedOption)?.detailsImg} 
                    alt={`${selectedOption} insurance data`}
                    className="w-full h-auto rounded-md"
                  />
                  <p className="text-sm text-gray-500 mt-2">
                    Historical trigger events and payout frequency (last 5 years)
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="mt-12 bg-green-50 p-6 rounded-lg">
            <h3 className="text-xl font-bold text-green-600 mb-4">How Parametric Insurance Works</h3>
            <div className="space-y-4">
              <p className="text-gray-600">
                Our parametric insurance is different from traditional insurance in several ways:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-600">
                <li>Automatically triggered by verified oracle data</li>
                <li>No claims process or paperwork required</li>
                <li>Instant payouts when conditions are met</li>
                <li>Transparent and verifiable on the blockchain</li>
                <li>Customizable parameters to fit your specific needs</li>
                <li>Multiple oracle providers for greater data reliability</li>
              </ul>
            </div>
          </div>
        </div>
      )}
      
      {/* オラクルプロバイダータブ */}
      {activeTab === 'providers' && (
        <div>
          <p className="text-gray-600 mb-8">
            We integrate with multiple oracle providers to ensure reliable and accurate data
            for triggering insurance payouts. Each provider has its own strengths and specialties.
          </p>
          
          <div className="grid md:grid-cols-3 gap-6 mb-10">
            {oracleProviders.map((provider) => (
              <div key={provider.id} className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-blue-600">{provider.name}</h3>
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                    {provider.reliability}% Reliability
                  </span>
                </div>
                <p className="text-gray-600 mb-4">{provider.description}</p>
                <div className="space-y-2">
                  <div>
                    <span className="font-semibold">Update Frequency:</span>
                    <span className="text-gray-600 ml-2">{provider.updateFrequency}</span>
                  </div>
                  <div>
                    <span className="font-semibold">Data Types:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {provider.dataTypes.map(dataType => (
                        <span 
                          key={dataType} 
                          className="px-2 py-1 bg-gray-100 text-xs rounded-full"
                        >
                          {dataType}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-bold text-blue-600 mb-4">Oracle Integration Process</h3>
            <div className="grid md:grid-cols-3 gap-4 text-center">
              <div className="p-4 border rounded-md">
                <div className="text-2xl font-bold text-blue-500 mb-2">1</div>
                <h4 className="font-semibold mb-2">Data Collection</h4>
                <p className="text-sm text-gray-600">
                  Oracle nodes collect real-world data from multiple sources, ensuring data quality and accuracy.
                </p>
              </div>
              <div className="p-4 border rounded-md">
                <div className="text-2xl font-bold text-blue-500 mb-2">2</div>
                <h4 className="font-semibold mb-2">Consensus Verification</h4>
                <p className="text-sm text-gray-600">
                  Multiple nodes verify the data and reach consensus, eliminating outliers and inaccuracies.
                </p>
              </div>
              <div className="p-4 border rounded-md">
                <div className="text-2xl font-bold text-blue-500 mb-2">3</div>
                <h4 className="font-semibold mb-2">On-Chain Publishing</h4>
                <p className="text-sm text-gray-600">
                  Verified data is published on-chain, where our smart contracts can access it to trigger insurance payouts.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* データ集約タブ */}
      {activeTab === 'aggregation' && (
        <div>
          <p className="text-gray-600 mb-8">
            Our advanced data aggregation system combines information from multiple oracle providers
            to ensure accuracy and prevent manipulation. This creates a more reliable trigger mechanism
            for your insurance policies.
          </p>
          
          <div className="bg-white p-6 rounded-lg shadow-md mb-10">
            <h3 className="text-xl font-bold text-purple-600 mb-6">Aggregation Methodology</h3>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h4 className="font-semibold mb-3">Data Sources</h4>
                <p className="text-gray-600 mb-4">
                  We collect data from multiple oracle providers, each with their own network of nodes and data sources.
                  This redundancy helps eliminate single points of failure.
                </p>
                
                <h4 className="font-semibold mb-3 mt-6">Consensus Requirements</h4>
                <p className="text-gray-600">
                  For weather-related triggers, we require at least 2/3 of providers to report similar conditions.
                  For crop yield and business metrics, we use a weighted average based on provider reliability scores.
                </p>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-md">
                <h4 className="font-semibold mb-3">Aggregation Algorithm</h4>
                <pre className="bg-gray-900 text-gray-100 p-4 rounded-md text-sm overflow-x-auto">
{`// Simplified pseudocode
function aggregateOracleData(data) {
  const threshold = 2/3;
  
  // Count adverse condition reports
  const adverseCount = data.filter(
    d => d.weatherCondition === "Adverse"
  ).length;
  
  // Calculate median for numerical values
  const rainValues = data.map(d => d.rainAmount);
  const medianRain = calculateMedian(rainValues);
  
  // Determine consensus
  const isAdverse = adverseCount / data.length >= threshold;
  
  return {
    weatherCondition: isAdverse ? "Adverse" : "Normal",
    rainAmount: medianRain,
    timestamp: getCurrentTimestamp()
  };
}`}
                </pre>
              </div>
            </div>
            
            <div className="mt-8 border-t pt-6">
              <h4 className="font-semibold mb-3">Example Aggregation Scenario</h4>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Oracle Provider</th>
                      <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Weather Condition</th>
                      <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rainfall (mm)</th>
                      <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Wind Speed (km/h)</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap">Pyth</td>
                      <td className="px-6 py-4 whitespace-nowrap">Adverse</td>
                      <td className="px-6 py-4 whitespace-nowrap">42</td>
                      <td className="px-6 py-4 whitespace-nowrap">68</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap">Switchboard</td>
                      <td className="px-6 py-4 whitespace-nowrap">Adverse</td>
                      <td className="px-6 py-4 whitespace-nowrap">38</td>
                      <td className="px-6 py-4 whitespace-nowrap">72</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap">Chainlink</td>
                      <td className="px-6 py-4 whitespace-nowrap">Normal</td>
                      <td className="px-6 py-4 whitespace-nowrap">45</td>
                      <td className="px-6 py-4 whitespace-nowrap">65</td>
                    </tr>
                    <tr className="bg-green-50">
                      <td className="px-6 py-4 whitespace-nowrap font-medium">Aggregated Result</td>
                      <td className="px-6 py-4 whitespace-nowrap font-medium">Adverse (2/3)</td>
                      <td className="px-6 py-4 whitespace-nowrap font-medium">42 (median)</td>
                      <td className="px-6 py-4 whitespace-nowrap font-medium">68 (median)</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="text-sm text-gray-500 mt-2">
                In this example, our aggregation algorithm would determine that the weather condition is adverse,
                triggering the insurance payout if the rainfall is below the policy's threshold.
              </p>
            </div>
          </div>
          
          <div className="bg-purple-50 p-6 rounded-lg">
            <h3 className="text-xl font-bold text-purple-600 mb-4">Benefits of Multi-Oracle Data Aggregation</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-2">Enhanced Reliability</h4>
                <p className="text-gray-600">
                  By aggregating data from multiple sources, we minimize the risk of incorrect readings
                  or temporary outages affecting your insurance coverage.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Manipulation Resistance</h4>
                <p className="text-gray-600">
                  Our consensus mechanism makes it extremely difficult for any single party to
                  manipulate the oracle data, ensuring fair insurance payouts.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Broader Coverage</h4>
                <p className="text-gray-600">
                  Different oracles excel at different types of data, allowing us to offer
                  more comprehensive insurance products tailored to your needs.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Transparent Verification</h4>
                <p className="text-gray-600">
                  All data sources and aggregation results are recorded on-chain, allowing
                  full transparency and verification of insurance triggers.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Insurance; 