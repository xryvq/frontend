'use client';

import { useState } from 'react';
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseUnits } from 'viem';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useUserBalances } from '@/hooks/useContractReads';
import { CONTRACTS, ABIS, PROTOCOL_CONSTANTS } from '@/config/contracts';

export default function BorrowPage() {
  const { address, isConnected } = useAccount();
  const [collateralAmount, setCollateralAmount] = useState('');
  const [loanAmount, setLoanAmount] = useState('');
  const [activeStep, setActiveStep] = useState<'collateral' | 'loan'>('collateral');
  const [isApproving, setIsApproving] = useState(false);
  const [isSubmittingCollateral, setIsSubmittingCollateral] = useState(false);
  const [isCreatingWallet, setIsCreatingWallet] = useState(false);
  const [restrictedWalletAddress, setRestrictedWalletAddress] = useState<string>('');
  const [error, setError] = useState<string>('');

  const { writeContract, data: hash, isPending } = useWriteContract();
  const { isLoading: isConfirming } = useWaitForTransactionReceipt({ hash });

  const userBalances = useUserBalances(address);

  // Calculate collateral needed based on loan amount (20% of loan)
  const calculateCollateralFromLoan = (loan: string) => {
    if (!loan) return '0';
    const loanNum = Number(loan);
    return (loanNum * 0.2).toString(); // 20% collateral
  };

  // Calculate max loan based on collateral (5x collateral)
  const calculateLoanFromCollateral = (collateral: string) => {
    if (!collateral) return '0';
    const collateralNum = Number(collateral);
    return (collateralNum * 5).toString(); // 5x leverage
  };

  const handleLoanAmountChange = (value: string) => {
    const loanNum = Number(value);
    
    // Validate loan amount limits
    if (loanNum < PROTOCOL_CONSTANTS.MIN_LOAN_AMOUNT || loanNum > PROTOCOL_CONSTANTS.MAX_LOAN_AMOUNT) {
      setError(`Loan amount must be between $${PROTOCOL_CONSTANTS.MIN_LOAN_AMOUNT} and $${PROTOCOL_CONSTANTS.MAX_LOAN_AMOUNT.toLocaleString()}`);
    } else {
      setError('');
    }
    
    setLoanAmount(value);
    setCollateralAmount(calculateCollateralFromLoan(value));
  };

  const handleCollateralChange = (value: string) => {
    setCollateralAmount(value);
    setLoanAmount(calculateLoanFromCollateral(value));
    setError(''); // Clear any existing errors
  };

  const handleMaxCollateral = () => {
    const maxCollateral = Math.min(
      Number(userBalances.usdcBalance),
      PROTOCOL_CONSTANTS.MAX_LOAN_AMOUNT * 0.2 // Max collateral for max loan
    );
    handleCollateralChange(maxCollateral.toString());
  };

  const handlePresetLoan = (amount: number) => {
    handleLoanAmountChange(amount.toString());
  };

  const handleSubmitCollateral = async () => {
    if (!collateralAmount || !address) return;
    
    try {
      setError('');
      const amount = parseUnits(collateralAmount, PROTOCOL_CONSTANTS.USDC_DECIMALS);
      
      // Step 1: Approve USDC
      setIsApproving(true);
      await writeContract({
        abi: ABIS.MockUSDC,
        address: CONTRACTS.MockUSDC,
        functionName: 'approve',
        args: [CONTRACTS.CollateralManager, amount],
        gas: BigInt(100000), // Set reasonable gas limit
      });
      
      setIsApproving(false);
      setIsSubmittingCollateral(true);
      
      // Step 2: Submit collateral (smart contract will auto create/use restricted wallet)
      await writeContract({
        abi: ABIS.CollateralManager,
        address: CONTRACTS.CollateralManager,
        functionName: 'submitCollateral',
        args: [amount],
        gas: BigInt(500000), // Set reasonable gas limit
      });
      
      setIsSubmittingCollateral(false);
      setActiveStep('loan');
    } catch (error: any) {
      console.error('Collateral submission failed:', error);
      setError(error?.message || 'Transaction failed');
      setIsApproving(false);
      setIsSubmittingCollateral(false);
    }
  };

  const handleInitiateLoan = async () => {
    if (!loanAmount || !address) return;
    
    const loanAmountNum = Number(loanAmount);
    
    // Validate loan amount
    if (loanAmountNum < PROTOCOL_CONSTANTS.MIN_LOAN_AMOUNT) {
      setError(`Minimum loan amount is $${PROTOCOL_CONSTANTS.MIN_LOAN_AMOUNT}`);
      return;
    }
    
    if (loanAmountNum > PROTOCOL_CONSTANTS.MAX_LOAN_AMOUNT) {
      setError(`Maximum loan amount is $${PROTOCOL_CONSTANTS.MAX_LOAN_AMOUNT.toLocaleString()}`);
      return;
    }
    
    try {
      setError('');
      
      // Step 1: Create or get restricted wallet first
      setIsCreatingWallet(true);
      const walletResult = await writeContract({
        abi: ABIS.RestrictedWalletFactory,
        address: CONTRACTS.RestrictedWalletFactory,
        functionName: 'getOrCreateWallet',
        args: [address],
        gas: BigInt(500000),
      });
      
      setIsCreatingWallet(false);
      
      // Step 2: Initiate loan
      await writeContract({
        abi: ABIS.LoanManager,
        address: CONTRACTS.LoanManager,
        functionName: 'initiateLoan',
        args: [parseUnits(loanAmount, PROTOCOL_CONSTANTS.USDC_DECIMALS)],
        gas: BigInt(500000), // Set reasonable gas limit
      });
    } catch (error: any) {
      console.error('Loan initiation failed:', error);
      setError(error?.message || 'Loan initiation failed');
      setIsCreatingWallet(false);
    }
  };

  const isValidLoanAmount = () => {
    const loanNum = Number(loanAmount);
    return loanNum >= PROTOCOL_CONSTANTS.MIN_LOAN_AMOUNT && loanNum <= PROTOCOL_CONSTANTS.MAX_LOAN_AMOUNT;
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-dark-gray">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div>
              <a href="/" className="hover:opacity-80 transition-opacity">
                <h1 className="text-3xl font-bold text-teal-600">Levra</h1>
                <p className="text-gray-400 text-sm">Borrow with Leverage</p>
              </a>
            </div>
            <div className="flex items-center gap-4">
              <a
                href="/deposit-withdraw"
                className="px-4 py-2 bg-teal-900 text-teal-300 rounded-lg hover:bg-teal-800 transition-colors text-sm"
              >
                Deposit & Withdraw
              </a>
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
        {/* Coming Soon Notice */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-teal-600/20 border border-teal-600/40 rounded-xl">
            <span className="text-teal-400">🚧</span>
            <span className="text-teal-300 font-medium">PoC Borrow - Coming Soon</span>
          </div>
        </div>

        {/* Protocol Overview */}
        <div className="max-w-4xl mx-auto mb-12">
          <h2 className="text-3xl font-bold text-center mb-8">Leverage Borrowing Flow</h2>
          <div className="bg-teal-600/10 border border-teal-600/30 rounded-xl p-6">
            <p className="text-teal-300 text-center mb-6">
              Borrow dengan model 20/80: Submit 20% kolateral USDC, dapatkan 80% additional capital dari lending pool
            </p>
            
            {/* Loan Limits */}
            <div className="bg-black/50 rounded-lg p-4 mb-6">
              <h4 className="text-white font-medium mb-2">Loan Limits</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-400">Minimum:</span>
                  <span className="text-teal-400 ml-2">${PROTOCOL_CONSTANTS.MIN_LOAN_AMOUNT}</span>
                </div>
                <div>
                  <span className="text-gray-400">Maximum:</span>
                  <span className="text-teal-400 ml-2">${PROTOCOL_CONSTANTS.MAX_LOAN_AMOUNT.toLocaleString()}</span>
                </div>
              </div>
            </div>
            
            {/* Process Steps */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-teal-600 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-black font-bold">1</span>
                </div>
                <h4 className="font-medium text-white mb-2">Submit Collateral</h4>
                <p className="text-sm text-gray-400">20% USDC sebagai kolateral</p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-teal-500 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-black font-bold">2</span>
                </div>
                <h4 className="font-medium text-white mb-2">Get Loan</h4>
                <p className="text-sm text-gray-400">80% dari lending pool</p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-teal-400 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-black font-bold">3</span>
                </div>
                <h4 className="font-medium text-white mb-2">Trade</h4>
                <p className="text-sm text-gray-400">Via whitelisted DEX</p>
              </div>
            </div>
          </div>
        </div>

        {isConnected ? (
          <div className="max-w-md mx-auto">
            {/* Progress Indicator */}
            <div className="flex justify-center mb-8">
              <div className="flex items-center gap-4">
                {['collateral', 'loan'].map((step, index) => (
                  <div key={step} className="flex items-center">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                        activeStep === step
                          ? 'bg-teal-600 text-black'
                          : index < ['collateral', 'loan'].indexOf(activeStep)
                          ? 'bg-teal-400 text-black'
                          : 'bg-gray-600 text-gray-300'
                      }`}
                    >
                      {index + 1}
                    </div>
                    {index < 1 && (
                      <div
                        className={`w-8 h-1 mx-2 ${
                          index < ['collateral', 'loan'].indexOf(activeStep)
                            ? 'bg-teal-400'
                            : 'bg-gray-600'
                        }`}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Network Info for Arbitrum Sepolia */}
            <div className="bg-blue-600/10 border border-blue-600/30 rounded-xl p-4 mb-6">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="text-blue-400 font-medium">Arbitrum Sepolia Testnet</span>
              </div>
              <p className="text-blue-300 text-sm">
                Pastikan wallet terhubung ke Arbitrum Sepolia untuk gas fee yang rendah
              </p>
            </div>

            {/* Error Display */}
            {error && (
              <div className="bg-red-600/10 border border-red-600/30 rounded-xl p-4 mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-red-400">⚠️</span>
                  <span className="text-red-400 font-medium">Error</span>
                </div>
                <p className="text-red-300 text-sm">{error}</p>
                <details className="mt-2">
                  <summary className="text-red-400 text-xs cursor-pointer">Debug Info</summary>
                  <p className="text-red-300 text-xs mt-1">
                    Contract: LoanManager ({CONTRACTS.LoanManager})
                    <br />
                    Function: initiateLoan
                    <br />
                    Min: ${PROTOCOL_CONSTANTS.MIN_LOAN_AMOUNT} | Max: ${PROTOCOL_CONSTANTS.MAX_LOAN_AMOUNT.toLocaleString()}
                  </p>
                </details>
              </div>
            )}

            {/* User Balance Info */}
            <div className="bg-dark-gray border border-gray-800 rounded-xl p-6 mb-6">
              <h3 className="text-lg font-medium text-white mb-4">Your Balance</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-300">USDC Balance:</span>
                  <span className="text-white font-medium">
                    {userBalances.isLoading ? '...' : Number(userBalances.usdcBalance).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            {/* Step 1: Submit Collateral */}
            {activeStep === 'collateral' && (
              <div className="bg-dark-gray border border-gray-800 rounded-xl p-6">
                <h3 className="text-lg font-medium text-white mb-4">Step 1: Set Loan Amount & Collateral</h3>
                <p className="text-gray-300 mb-6">
                  Tentukan jumlah loan yang diinginkan. Kolateral 20% akan dihitung otomatis.
                </p>
                
                <div className="space-y-4">
                  {/* Preset Loan Amounts */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Quick Select Loan Amount
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {[500, 1000, 5000].map((amount) => (
                        <button
                          key={amount}
                          onClick={() => handlePresetLoan(amount)}
                          className="px-3 py-2 bg-teal-900 text-teal-300 rounded-lg hover:bg-teal-800 transition-colors text-sm"
                        >
                          ${amount}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Loan Amount ($)
                    </label>
                    <input
                      type="number"
                      value={loanAmount}
                      onChange={(e) => handleLoanAmountChange(e.target.value)}
                      placeholder={`${PROTOCOL_CONSTANTS.MIN_LOAN_AMOUNT} - ${PROTOCOL_CONSTANTS.MAX_LOAN_AMOUNT.toLocaleString()}`}
                      min={PROTOCOL_CONSTANTS.MIN_LOAN_AMOUNT}
                      max={PROTOCOL_CONSTANTS.MAX_LOAN_AMOUNT}
                      className="w-full bg-black border border-gray-700 text-white rounded-xl px-4 py-3 focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Required Collateral (20%)
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        value={collateralAmount}
                        onChange={(e) => handleCollateralChange(e.target.value)}
                        placeholder="0.00"
                        className="w-full bg-black border border-gray-700 text-white rounded-xl px-4 py-3 pr-16 focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      />
                      <button
                        onClick={handleMaxCollateral}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-teal-400 text-sm font-medium hover:text-teal-300"
                      >
                        MAX
                      </button>
                    </div>
                  </div>

                  {collateralAmount && loanAmount && (
                    <div className="bg-black rounded-lg p-4">
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Loan Amount:</span>
                          <span className="text-white font-medium">${Number(loanAmount).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Kolateral Anda (20%):</span>
                          <span className="text-white">${Number(collateralAmount).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">From Pool (80%):</span>
                          <span className="text-teal-400">${(Number(loanAmount) * 0.8).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between border-t border-gray-700 pt-2">
                          <span className="text-gray-400">Total Capital:</span>
                          <span className="text-white font-medium">
                            ${Number(loanAmount).toFixed(2)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Leverage:</span>
                          <span className="text-teal-400 font-medium">5x</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Transaction Status */}
                  {(isApproving || isSubmittingCollateral) && (
                    <div className="bg-black border border-teal-600/30 rounded-lg p-4">
                      <div className="flex items-center gap-3">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-teal-400"></div>
                        <div>
                          <p className="text-white font-medium">
                            {isApproving ? 'Menyetujui USDC...' : 'Mengirim Kolateral...'}
                          </p>
                          <p className="text-gray-400 text-sm">
                            {isApproving ? 'Langkah 1/2: Approve USDC untuk kontrak' : 'Langkah 2/2: Submit kolateral'}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  <button
                    onClick={handleSubmitCollateral}
                    disabled={!collateralAmount || !isValidLoanAmount() || isApproving || isSubmittingCollateral || Number(collateralAmount) > Number(userBalances.usdcBalance)}
                    className="w-full bg-teal-600 hover:bg-teal-500 disabled:bg-gray-600 disabled:cursor-not-allowed text-black font-medium py-3 rounded-xl transition-colors"
                  >
                    {isApproving || isSubmittingCollateral ? 'Processing...' : 'Submit Kolateral'}
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Initiate Loan */}
            {activeStep === 'loan' && (
              <div className="bg-dark-gray border border-gray-800 rounded-xl p-6">
                <h3 className="text-lg font-medium text-white mb-4">Step 2: Initiate Loan</h3>
                <p className="text-gray-300 mb-6">
                  Request loan dari lending pool. Sistem akan membuat restricted wallet terlebih dahulu.
                </p>
                
                <div className="space-y-4">
                  <div className="bg-green-600/10 border border-green-600/30 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                        <span className="text-black text-xs">✓</span>
                      </div>
                      <span className="text-green-400 font-medium">Kolateral berhasil disubmit</span>
                    </div>
                    <p className="text-green-300 text-sm">Kolateral tersimpan dengan aman di CollateralManager.</p>
                  </div>

                  <div className="bg-black rounded-lg p-4">
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Loan Amount:</span>
                        <span className="text-white font-medium">${Number(loanAmount).toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Kolateral Anda:</span>
                        <span className="text-white">${Number(collateralAmount).toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">From Pool:</span>
                        <span className="text-teal-400">${(Number(loanAmount) * 0.8).toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Leverage Ratio:</span>
                        <span className="text-white">5x</span>
                      </div>
                    </div>
                  </div>

                  {/* Validation Warning */}
                  {!isValidLoanAmount() && (
                    <div className="bg-yellow-600/10 border border-yellow-600/30 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-yellow-400">⚠️</span>
                        <span className="text-yellow-400 font-medium">Invalid Loan Amount</span>
                      </div>
                      <p className="text-yellow-300 text-sm">
                        Loan amount must be between ${PROTOCOL_CONSTANTS.MIN_LOAN_AMOUNT} and ${PROTOCOL_CONSTANTS.MAX_LOAN_AMOUNT.toLocaleString()}
                      </p>
                    </div>
                  )}

                  {/* Transaction Status for Loan */}
                  {(isCreatingWallet || isPending || isConfirming) && (
                    <div className="bg-black border border-teal-600/30 rounded-lg p-4">
                      <div className="flex items-center gap-3">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-teal-400"></div>
                        <div>
                          <p className="text-white font-medium">
                            {isCreatingWallet ? 'Membuat Restricted Wallet...' : 'Memproses Loan...'}
                          </p>
                          <p className="text-gray-400 text-sm">
                            {isCreatingWallet ? 'Langkah 1/2: Deploy restricted wallet' : 'Langkah 2/2: Initiate loan dari pool'}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  <button
                    onClick={handleInitiateLoan}
                    disabled={!loanAmount || !isValidLoanAmount() || isCreatingWallet || isPending || isConfirming}
                    className="w-full bg-teal-600 hover:bg-teal-500 disabled:bg-gray-600 disabled:cursor-not-allowed text-black font-medium py-3 rounded-xl transition-colors"
                  >
                    {isCreatingWallet || isPending || isConfirming ? 'Processing...' : 'Create Wallet & Request Loan'}
                  </button>
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="mt-6 text-center">
              <a
                href="/"
                className="inline-flex items-center px-4 py-2 text-teal-400 hover:text-teal-300 transition-colors"
              >
                ← Kembali ke Home
              </a>
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-white mb-4">Connect Your Wallet</h2>
            <p className="text-gray-400 mb-8">Connect wallet untuk memulai proses borrowing</p>
            <ConnectButton />
          </div>
        )}
      </div>
    </div>
  );
} 