import { LENDING_POOL_ABI, LENDING_POOL_ADDRESS } from '@/abis/lending-pool';
import { MOCK_USDC_ABI, MOCK_USDC_ADDRESS } from '@/abis/mock-usdc';
import { COLLATERAL_MANAGER_ABI, COLLATERAL_MANAGER_ADDRESS } from '@/abis/collateral-manager';
import { LOAN_MANAGER_ABI, LOAN_MANAGER_ADDRESS } from '@/abis/loan-manager';
import { RESTRICTED_WALLET_FACTORY_ABI, RESTRICTED_WALLET_FACTORY_ADDRESS } from '@/abis/restricted-wallet-factory';

export const CONTRACTS = {
  MockUSDC: MOCK_USDC_ADDRESS,
  LendingPool: LENDING_POOL_ADDRESS,
  CollateralManager: COLLATERAL_MANAGER_ADDRESS,
  LoanManager: LOAN_MANAGER_ADDRESS,
  RestrictedWalletFactory: RESTRICTED_WALLET_FACTORY_ADDRESS,
} as const;

export const ABIS = {
  MockUSDC: MOCK_USDC_ABI,
  LendingPool: LENDING_POOL_ABI,
  CollateralManager: COLLATERAL_MANAGER_ABI,
  LoanManager: LOAN_MANAGER_ABI,
  RestrictedWalletFactory: RESTRICTED_WALLET_FACTORY_ABI,
} as const;

// Constants from smart contracts
export const PROTOCOL_CONSTANTS = {
  FIXED_APY: 800, // 8% APY in basis points
  BASIS_POINTS: 10000,
  USDC_DECIMALS: 6,
  // Loan Manager constants
  MIN_LOAN_AMOUNT: 100, // $100 USDC
  MAX_LOAN_AMOUNT: 100000, // $100,000 USDC
  COLLATERAL_RATIO: 2000, // 20% in basis points
  POOL_RATIO: 8000, // 80% in basis points
} as const; 