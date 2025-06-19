'use client';

import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';
import { useLendingPoolStats } from '@/hooks/useContractReads';

export default function LandingPage() {
  const { isConnected } = useAccount();
  const poolStats = useLendingPoolStats();

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-dark-gray">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-teal-600">Levra</h1>
              <p className="text-gray-400 text-sm">Leverage Protocol</p>
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

      {/* Hero Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6">
            Leverage Protocol <span className="text-teal-400">20/80</span>
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Deposit USDC dan dapatkan yield 8% APY dari protokol leverage. 
            Borrower menyediakan 20% kolateral, 80% dipinjam dari retail investor.
          </p>
          
      
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/deposit-withdraw"
                className="px-8 py-4 bg-teal-600 text-black rounded-xl font-semibold hover:bg-teal-500 transition-colors"
              >
                Deposit & Earn
              </a>
              <a
                href="/borrow"
                className="px-8 py-4 bg-teal-900 border border-teal-700 text-teal-300 rounded-xl font-semibold hover:bg-teal-800 transition-colors"
              >
                Borrow (Coming Soon)
              </a>
            </div>
          
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-dark-gray/50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Protocol Statistics</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="bg-dark-gray border border-gray-800 rounded-xl p-6 text-center">
              <div className="text-3xl font-bold text-teal-400 mb-2">
                ${poolStats.isLoading ? '...' : Number(poolStats.totalAssets).toLocaleString()}
              </div>
              <div className="text-gray-300 text-sm">Total Value Locked</div>
            </div>
            
            <div className="bg-dark-gray border border-gray-800 rounded-xl p-6 text-center">
              <div className="text-3xl font-bold text-teal-400 mb-2">8%</div>
              <div className="text-gray-300 text-sm">Fixed APY for Lenders</div>
            </div>
            
            <div className="bg-dark-gray border border-gray-800 rounded-xl p-6 text-center">
              <div className="text-3xl font-bold text-teal-400 mb-2">20/80</div>
              <div className="text-gray-300 text-sm">Leverage Ratio</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-4xl mx-auto">
            {/* Retail Investors */}
            <div className="space-y-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-teal-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">💰</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">For Retail Investors</h3>
              </div>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-teal-600 rounded-full flex items-center justify-center text-black text-sm font-bold mt-1">1</div>
                  <div>
                    <div className="font-medium text-white">Deposit USDC</div>
                    <div className="text-sm text-gray-400">Deposit ke Lending Pool</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-teal-600 rounded-full flex items-center justify-center text-black text-sm font-bold mt-1">2</div>
                  <div>
                    <div className="font-medium text-white">Earn 8% APY</div>
                    <div className="text-sm text-gray-400">Otomatis mendapat yield</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-teal-600 rounded-full flex items-center justify-center text-black text-sm font-bold mt-1">3</div>
                  <div>
                    <div className="font-medium text-white">Withdraw Anytime</div>
                    <div className="text-sm text-gray-400">Sesuai available liquidity</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Borrowers */}
            <div className="space-y-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-teal-900 border border-teal-700 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">📈</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">For Borrowers</h3>
              </div>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-teal-500 rounded-full flex items-center justify-center text-black text-sm font-bold mt-1">1</div>
                  <div>
                    <div className="font-medium text-white">Submit 20% Collateral</div>
                    <div className="text-sm text-gray-400">USDC sebagai kolateral</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-teal-500 rounded-full flex items-center justify-center text-black text-sm font-bold mt-1">2</div>
                  <div>
                    <div className="font-medium text-white">Borrow 80% from Pool</div>
                    <div className="text-sm text-gray-400">Leverage trading capital</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-teal-500 rounded-full flex items-center justify-center text-black text-sm font-bold mt-1">3</div>
                  <div>
                    <div className="font-medium text-white">Trade via Restricted Wallet</div>
                    <div className="text-sm text-gray-400">Whitelist DEX only</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-teal-600/10 border-y border-teal-600/20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Start?</h2>
          <p className="text-gray-300 mb-8">
            Connect your wallet and choose your role in the Levra ecosystem
          </p>
          
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/deposit-withdraw"
                className="px-8 py-4 bg-teal-600 text-black rounded-xl font-semibold hover:bg-teal-500 transition-colors"
              >
                Start Earning 8% APY
              </a>
              <a
                href="/borrow"
                className="px-8 py-4 bg-transparent border border-teal-600 text-teal-400 rounded-xl font-semibold hover:bg-teal-600/10 transition-colors"
              >
                Explore Borrowing
              </a>
            </div>
          
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-dark-gray">
        <div className="container mx-auto px-4 text-center text-gray-400">
          <p>&copy; 2024 Levra Protocol. This is a Proof of Concept for testing only.</p>
        </div>
      </footer>
    </div>
  );
} 