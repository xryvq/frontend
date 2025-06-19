"use client";

import { useState } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount, useWriteContract, useWaitForTransactionReceipt, useReadContract } from "wagmi";
import { parseUnits, formatUnits } from "viem";
import { MOCK_USDC_ABI, MOCK_USDC_ADDRESS } from "@/abis/mock-usdc";
import { useUserBalances } from '@/hooks/useContractReads';
import { CONTRACTS, ABIS, PROTOCOL_CONSTANTS } from '@/config/contracts';

export default function FaucetPage() {
  const [amount, setAmount] = useState("1000");
  const [isLoading, setIsLoading] = useState(false);
  
  const { address, isConnected } = useAccount();
  const { writeContract, data: hash, error, isPending } = useWriteContract();
  
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  });

  // Read user's current USDC balance
  const { data: usdcBalance } = useReadContract({
    address: MOCK_USDC_ADDRESS,
    abi: MOCK_USDC_ABI,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    }
  });

  const userBalances = useUserBalances(address);

  const handleMint = async () => {
    if (!address || !amount) return;
    
    try {
      setIsLoading(true);
      
      // Convert amount to wei (USDC has 6 decimals)
      const amountInWei = parseUnits(amount, 6);
      
      await writeContract({
        address: MOCK_USDC_ADDRESS,
        abi: MOCK_USDC_ABI,
        functionName: "mint",
        args: [address, amountInWei],
      });
    } catch (err) {
      console.error("Error minting USDC:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const presetAmounts = ["100", "500", "1000", "5000"];

  // Format balance for display
  const formattedBalance = usdcBalance ? formatUnits(usdcBalance, 6) : "0";

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-dark-gray">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div>
              <a href="/" className="hover:opacity-80 transition-opacity">
                <h1 className="text-3xl font-bold text-teal-600">Levra Faucet</h1>
                <p className="text-gray-400 text-sm">Get test USDC tokens</p>
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
                href="/borrow"
                className="px-4 py-2 bg-teal-900 text-teal-300 rounded-lg hover:bg-teal-800 transition-colors text-sm"
              >
                Borrow
              </a>
              <ConnectButton />
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {isConnected ? (
          <div className="max-w-md mx-auto">
            {/* Current Balance */}
            <div className="bg-dark-gray border border-gray-800 rounded-xl p-6 mb-6">
              <h3 className="text-lg font-medium text-white mb-4">Current Balance</h3>
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Mock USDC:</span>
                <span className="text-2xl font-bold text-white">
                  {userBalances.isLoading ? '...' : Number(userBalances.usdcBalance).toFixed(2)}
                </span>
              </div>
            </div>

            {/* Mint Interface */}
            <div className="bg-dark-gray border border-gray-800 rounded-xl p-6">
              <h3 className="text-lg font-medium text-white mb-6">Mint Test USDC</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Amount to Mint
                  </label>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="1000"
                    className="w-full bg-black border border-gray-700 text-white rounded-xl px-4 py-3 focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
                  <p className="text-xs text-gray-400 mt-1">
                    Enter the amount of test USDC you want to mint
                  </p>
                </div>

                {/* Quick Amount Buttons */}
                <div className="grid grid-cols-3 gap-2">
                  {['100', '1000', '10000'].map((amount) => (
                    <button
                      key={amount}
                      onClick={() => setAmount(amount)}
                      className="py-2 px-4 bg-black border border-gray-700 text-gray-300 rounded-lg hover:border-teal-500 hover:text-teal-400 transition-colors"
                    >
                      {amount}
                    </button>
                  ))}
                </div>

                {/* Mint Button */}
                <button
                  onClick={handleMint}
                  disabled={isPending || isConfirming || !amount}
                  className="w-full bg-teal-600 hover:bg-teal-500 disabled:bg-gray-600 disabled:cursor-not-allowed text-black font-medium py-3 rounded-xl transition-colors"
                >
                  {isPending || isConfirming ? 'Minting...' : `Mint ${amount} USDC`}
                </button>

                {/* Info */}
                <div className="bg-teal-200/10 border border-teal-200/30 rounded-xl p-4">
                  <p className="text-teal-300 text-sm">
                    ℹ️ This is test USDC for the Arbitrum Sepolia network. 
                    Use it to test deposits and withdrawals in the Levra protocol.
                  </p>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <div className="mt-6 text-center">
              <a
                href="/"
                className="inline-flex items-center px-4 py-2 text-teal-400 hover:text-teal-300 transition-colors"
              >
                ← Back to Home
              </a>
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-white mb-4">Connect Your Wallet</h2>
            <p className="text-gray-400 mb-8">Connect your wallet to mint test USDC tokens</p>
            <ConnectButton />
          </div>
        )}
      </div>
    </div>
  );
}
