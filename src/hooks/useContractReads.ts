import { useReadContracts, useAccount } from 'wagmi';
import { CONTRACTS, ABIS, PROTOCOL_CONSTANTS } from '@/config/contracts';
import { formatUnits } from 'viem';

export function useLendingPoolStats() {
  const { data, isLoading, refetch } = useReadContracts({
    contracts: [
      {
        abi: ABIS.LendingPool,
        address: CONTRACTS.LendingPool,
        functionName: 'totalAssets',
      },
      {
        abi: ABIS.LendingPool,
        address: CONTRACTS.LendingPool,
        functionName: 'totalSupply',
      },
      {
        abi: ABIS.LendingPool,
        address: CONTRACTS.LendingPool,
        functionName: 'getVaultInfo',
      },
    ],
  });

  const totalAssets = data?.[0]?.result as bigint || BigInt(0);
  const totalShares = data?.[1]?.result as bigint || BigInt(0);
  const vaultInfo = data?.[2]?.result as [bigint, bigint, bigint, bigint] || [BigInt(0), BigInt(0), BigInt(0), BigInt(0)];

  return {
    totalAssets: formatUnits(totalAssets, PROTOCOL_CONSTANTS.USDC_DECIMALS),
    totalShares: formatUnits(totalShares, 18), // LP tokens are 18 decimals
    availableLiquidity: formatUnits(totalAssets, PROTOCOL_CONSTANTS.USDC_DECIMALS),
    apy: PROTOCOL_CONSTANTS.FIXED_APY / 100, // 8%
    lastUpdate: Number(vaultInfo[2]),
    isLoading,
    refetch,
  };
}

export function useUserBalances(address?: string) {
  const { data, isLoading, refetch } = useReadContracts({
    contracts: [
      {
        abi: ABIS.MockUSDC,
        address: CONTRACTS.MockUSDC,
        functionName: 'balanceOf',
        args: [address as `0x${string}`],
      },
      {
        abi: ABIS.LendingPool,
        address: CONTRACTS.LendingPool,
        functionName: 'balanceOf',
        args: [address as `0x${string}`],
      },
      {
        abi: ABIS.LendingPool,
        address: CONTRACTS.LendingPool,
        functionName: 'getUserInfo',
        args: [address as `0x${string}`],
      },
      {
        abi: ABIS.MockUSDC,
        address: CONTRACTS.MockUSDC,
        functionName: 'allowance',
        args: [address as `0x${string}`, CONTRACTS.LendingPool],
      },
    ],
    query: {
      enabled: !!address,
    },
  });

  const usdcBalance = data?.[0]?.result as bigint || BigInt(0);
  const lpTokenBalance = data?.[1]?.result as bigint || BigInt(0);
  const userInfo = data?.[2]?.result as [bigint, bigint, bigint] || [BigInt(0), BigInt(0), BigInt(0)];
  const allowance = data?.[3]?.result as bigint || BigInt(0);

  return {
    usdcBalance: formatUnits(usdcBalance, PROTOCOL_CONSTANTS.USDC_DECIMALS),
    lpTokenBalance: formatUnits(lpTokenBalance, 18),
    depositedAssets: formatUnits(userInfo[1], PROTOCOL_CONSTANTS.USDC_DECIMALS),
    pendingYield: formatUnits(userInfo[2], PROTOCOL_CONSTANTS.USDC_DECIMALS),
    allowance: formatUnits(allowance, PROTOCOL_CONSTANTS.USDC_DECIMALS),
    isLoading,
    refetch,
  };
} 