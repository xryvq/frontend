"use client";

import { useState } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { parseUnits } from "viem";
import { MOCK_USDC_ABI, MOCK_USDC_ADDRESS } from "@/abis/mock-usdc";

export default function FaucetPage() {
  const [amount, setAmount] = useState("100");
  const [isLoading, setIsLoading] = useState(false);
  
  const { address, isConnected } = useAccount();
  const { writeContract, data: hash, error, isPending } = useWriteContract();
  
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  });

  const handleMint = async () => {
    if (!address || !amount) return;
    
    try {
      setIsLoading(true);
      
      // Convert amount to wei (USDC has 18 decimals in this mock)
      const amountInWei = parseUnits(amount, 18);
      
      writeContract({
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            USDC Faucet
          </h1>
          <p className="text-gray-600">
            Dapatkan Mock USDC gratis untuk testing
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-xl p-6 space-y-6">
          {/* Connect Wallet */}
          <div className="flex justify-center">
            <ConnectButton />
          </div>

          {isConnected && (
            <>
              {/* Amount Input */}
              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700">
                  Jumlah USDC
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Masukkan jumlah"
                    min="1"
                    max="10000"
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    <span className="text-gray-500 text-sm">USDC</span>
                  </div>
                </div>
              </div>

              {/* Preset Amounts */}
              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700">
                  Jumlah Cepat
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {presetAmounts.map((preset) => (
                    <button
                      key={preset}
                      onClick={() => setAmount(preset)}
                      className={`px-3 py-2 text-sm rounded-lg border transition-colors ${
                        amount === preset
                          ? "bg-blue-500 text-white border-blue-500"
                          : "bg-gray-50 text-gray-700 border-gray-300 hover:bg-gray-100"
                      }`}
                    >
                      {preset}
                    </button>
                  ))}
                </div>
              </div>

              {/* Mint Button */}
              <button
                onClick={handleMint}
                disabled={!amount || isPending || isConfirming || isLoading}
                className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-3 px-4 rounded-lg font-medium hover:from-blue-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {isPending || isConfirming || isLoading
                  ? "Memproses..."
                  : `Mint ${amount} USDC`}
              </button>

              {/* Status Messages */}
              {hash && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="text-sm text-blue-800">
                    {isConfirming && (
                      <p>⏳ Menunggu konfirmasi transaksi...</p>
                    )}
                    {isConfirmed && (
                      <p>✅ Transaksi berhasil! USDC telah di-mint ke wallet Anda.</p>
                    )}
                  </div>
                  <div className="mt-2">
                    <a
                      href={`https://sepolia.arbiscan.io/tx/${hash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 text-sm underline"
                    >
                      Lihat di Explorer →
                    </a>
                  </div>
                </div>
              )}

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-sm text-red-800">
                    ❌ Error: {error.message}
                  </p>
                </div>
              )}

              {/* Contract Info */}
              <div className="bg-gray-50 rounded-lg p-4 text-sm">
                <h3 className="font-medium text-gray-700 mb-2">Info Contract:</h3>
                <div className="space-y-1 text-gray-600">
                  <p>Network: Arbitrum Sepolia</p>
                  <p>Contract: {MOCK_USDC_ADDRESS}</p>
                  <p className="break-all">Address: {address}</p>
                </div>
              </div>
            </>
          )}

          {!isConnected && (
            <div className="text-center py-8">
              <div className="text-gray-500 mb-4">
                <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <p className="text-gray-600">
                Silakan hubungkan wallet Anda untuk menggunakan faucet
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-gray-500">
          <p>
            Faucet ini hanya untuk testing di Arbitrum Sepolia testnet.
            <br />
            Token tidak memiliki nilai ekonomi.
          </p>
        </div>
      </div>
    </div>
  );
}
