'use client';

import { useState, useEffect } from 'react';
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseUnits } from 'viem';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useLendingPoolStats, useUserBalances } from '@/hooks/useContractReads';
import { CONTRACTS, ABIS, PROTOCOL_CONSTANTS } from '@/config/contracts';

export default function DepositWithdrawPage() {
  const { address, isConnected } = useAccount();
  const [activeTab, setActiveTab] = useState<'deposit' | 'withdraw'>('deposit');
  const [amount, setAmount] = useState('');
  const [isApproving, setIsApproving] = useState(false);
  const [isDepositing, setIsDepositing] = useState(false);
  const [currentStep, setCurrentStep] = useState<'approve' | 'deposit' | 'idle'>('idle');

  const { writeContract, data: hash, isPending } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const poolStats = useLendingPoolStats();
  const userBalances = useUserBalances(address);

  const handleApprove = async () => {
    if (!amount || !address) return;
    
    setCurrentStep('approve');
    setIsApproving(true);
    try {
      writeContract({
        abi: ABIS.MockUSDC,
        address: CONTRACTS.MockUSDC,
        functionName: 'approve',
        args: [CONTRACTS.LendingPool, parseUnits(amount, PROTOCOL_CONSTANTS.USDC_DECIMALS)],
      });
    } catch (error) {
      console.error('Approval failed:', error);
      setIsApproving(false);
      setCurrentStep('idle');
    }
  };

  const handleDeposit = async () => {
    if (!amount || !address) return;
    
    setCurrentStep('deposit');
    setIsDepositing(true);
    try {
      writeContract({
        abi: ABIS.LendingPool,
        address: CONTRACTS.LendingPool,
        functionName: 'deposit',
        args: [parseUnits(amount, PROTOCOL_CONSTANTS.USDC_DECIMALS), address],
      });
    } catch (error) {
      console.error('Deposit failed:', error);
      setIsDepositing(false);
      setCurrentStep('idle');
    }
  };

  // Handle transaction success
  useEffect(() => {
    if (isSuccess && currentStep === 'approve') {
      setIsApproving(false);
      setCurrentStep('idle');
      userBalances.refetch(); // Refresh allowance
    } else if (isSuccess && currentStep === 'deposit') {
      setIsDepositing(false);
      setCurrentStep('idle');
      setAmount(''); // Clear amount after successful deposit
      userBalances.refetch();
      poolStats.refetch();
    }
  }, [isSuccess, currentStep, userBalances, poolStats]);

  const handleWithdraw = async () => {
    if (!amount || !address) return;
    
    try {
      await writeContract({
        abi: ABIS.LendingPool,
        address: CONTRACTS.LendingPool,
        functionName: 'withdraw',
        args: [parseUnits(amount, PROTOCOL_CONSTANTS.USDC_DECIMALS), address, address],
      });
    } catch (error) {
      console.error('Withdraw failed:', error);
    }
  };

  const handleMaxClick = () => {
    if (activeTab === 'deposit') {
      setAmount(userBalances.usdcBalance);
    } else {
      setAmount(userBalances.depositedAssets);
    }
  };

  const needsApproval = activeTab === 'deposit' && 
    Number(userBalances.allowance) < Number(amount || '0');

  const isButtonDisabled = !amount || 
    (activeTab === 'deposit' && Number(amount) > Number(userBalances.usdcBalance)) ||
    (activeTab === 'withdraw' && Number(amount) > Number(userBalances.depositedAssets));

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-dark-gray">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div>
              <a href="/" className="hover:opacity-80 transition-opacity">
                <h1 className="text-3xl font-bold text-teal-600">Levra</h1>
                <p className="text-gray-400 text-sm">Leverage Protocol</p>
              </a>
            </div>
            <div className="flex items-center gap-4">
              <a
                href="/faucet"
                className="px-4 py-2 bg-teal-900 text-teal-300 rounded-lg hover:bg-teal-800 transition-colors text-sm"
              >
                Get Test USDC
              </a>
              <ConnectButton />
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Protocol Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-dark-gray border border-gray-800 rounded-xl p-6">
            <h3 className="text-gray-300 text-sm font-medium mb-2">Total Value Locked</h3>
            <p className="text-2xl font-bold text-white">
              ${poolStats.isLoading ? '...' : Number(poolStats.totalAssets).toLocaleString()}
            </p>
            <p className="text-teal-400 text-sm">USDC</p>
          </div>
          
          <div className="bg-dark-gray border border-gray-800 rounded-xl p-6">
            <h3 className="text-gray-300 text-sm font-medium mb-2">APY</h3>
            <p className="text-2xl font-bold text-teal-400">{poolStats.apy}%</p>
            <p className="text-gray-400 text-sm">Fixed Rate</p>
          </div>
          
          <div className="bg-dark-gray border border-gray-800 rounded-xl p-6">
            <h3 className="text-gray-300 text-sm font-medium mb-2">Available Liquidity</h3>
            <p className="text-2xl font-bold text-white">
              ${poolStats.isLoading ? '...' : Number(poolStats.availableLiquidity).toLocaleString()}
            </p>
            <p className="text-gray-400 text-sm">USDC</p>
          </div>
        </div>

        {/* Main Interface */}
        {isConnected ? (
          <div className="max-w-md mx-auto">
            {/* User Balances */}
            <div className="bg-dark-gray border border-gray-800 rounded-xl p-6 mb-6">
              <h3 className="text-lg font-medium text-white mb-4">Your Balances</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-300">USDC Balance:</span>
                  <span className="text-white font-medium">
                    {userBalances.isLoading ? '...' : Number(userBalances.usdcBalance).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Deposited:</span>
                  <span className="text-white font-medium">
                    {userBalances.isLoading ? '...' : Number(userBalances.depositedAssets).toFixed(2)}
                  </span>
                </div>
                
              </div>
            </div>

            {/* Deposit/Withdraw Interface */}
            <div className="bg-dark-gray border border-gray-800 rounded-xl p-6">
              {/* Tabs */}
              <div className="flex rounded-lg bg-black p-1 mb-6">
                <button
                  onClick={() => setActiveTab('deposit')}
                  className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                    activeTab === 'deposit'
                      ? 'bg-teal-600 text-black'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Deposit
                </button>
                <button
                  onClick={() => setActiveTab('withdraw')}
                  className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                    activeTab === 'withdraw'
                      ? 'bg-teal-600 text-black'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Withdraw
                </button>
              </div>

              {/* Amount Input */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    {activeTab === 'deposit' ? 'Deposit Amount' : 'Withdraw Amount'}
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="0.00"
                      className="w-full bg-black border border-gray-700 text-white rounded-xl px-4 py-3 pr-16 focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    />
                    <button
                      onClick={handleMaxClick}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-teal-400 text-sm font-medium hover:text-teal-300"
                    >
                      MAX
                    </button>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">
                    Balance: {activeTab === 'deposit' 
                      ? Number(userBalances.usdcBalance).toFixed(2)
                      : Number(userBalances.depositedAssets).toFixed(2)
                    } USDC
                  </p>
                </div>

                {/* Preview */}
                {amount && (
                  <div className="bg-black rounded-lg p-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">
                        {activeTab === 'deposit' ? 'You will receive:' : 'You will get back:'}
                      </span>
                      <span className="text-white font-medium">
                        ~{Number(amount).toFixed(2)} {activeTab === 'deposit' ? 'LP tokens' : 'USDC'}
                      </span>
                    </div>
                  </div>
                )}

                {/* Transaction Status */}
                {(currentStep !== 'idle' || isPending || isConfirming) && (
                  <div className="bg-teal-600/10 border border-teal-600/30 rounded-xl p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 border-2 border-teal-400 border-t-transparent rounded-full animate-spin"></div>
                      <div className="text-sm">
                        {currentStep === 'approve' && (isPending || isConfirming) && (
                          <span className="text-teal-300">
                            {isPending ? 'Approving USDC in wallet...' : 'Waiting for approval confirmation...'}
                          </span>
                        )}
                        {currentStep === 'deposit' && (isPending || isConfirming) && (
                          <span className="text-teal-300">
                            {isPending ? 'Depositing USDC in wallet...' : 'Waiting for deposit confirmation...'}
                          </span>
                        )}
                      </div>
                    </div>
                    {hash && (
                      <div className="mt-2">
                        <a
                          href={`https://sepolia.arbiscan.io/tx/${hash}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-teal-400 hover:text-teal-300 text-xs underline"
                        >
                          View on Arbiscan →
                        </a>
                      </div>
                    )}
                  </div>
                )}

                {/* Action Button */}
                {activeTab === 'deposit' ? (
                  needsApproval ? (
                    <button
                      onClick={handleApprove}
                      disabled={isApproving || isPending || isConfirming || isButtonDisabled}
                      className="w-full bg-teal-500 hover:bg-teal-400 disabled:bg-gray-600 disabled:cursor-not-allowed text-black font-medium py-3 rounded-xl transition-colors"
                    >
                      {(isApproving && currentStep === 'approve') || (isPending && currentStep === 'approve') || (isConfirming && currentStep === 'approve')
                        ? 'Approving USDC...'
                        : 'Approve USDC'
                      }
                    </button>
                  ) : (
                    <button
                      onClick={handleDeposit}
                      disabled={isDepositing || isPending || isConfirming || isButtonDisabled}
                      className="w-full bg-teal-600 hover:bg-teal-500 disabled:bg-gray-600 disabled:cursor-not-allowed text-black font-medium py-3 rounded-xl transition-colors"
                    >
                      {(isDepositing && currentStep === 'deposit') || (isPending && currentStep === 'deposit') || (isConfirming && currentStep === 'deposit')
                        ? 'Depositing USDC...'
                        : 'Deposit USDC'
                      }
                    </button>
                  )
                ) : (
                  <button
                    onClick={handleWithdraw}
                    disabled={isPending || isConfirming || isButtonDisabled}
                    className="w-full bg-teal-600 hover:bg-teal-500 disabled:bg-gray-600 disabled:cursor-not-allowed text-black font-medium py-3 rounded-xl transition-colors"
                  >
                    {isPending || isConfirming 
                      ? 'Withdrawing USDC...'
                      : 'Withdraw USDC'
                    }
                  </button>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-white mb-4">Connect Your Wallet</h2>
            <p className="text-gray-400 mb-8">Connect your wallet to start depositing and earning yield</p>
            <ConnectButton />
          </div>
        )}
      </div>
    </div>
  );
} 