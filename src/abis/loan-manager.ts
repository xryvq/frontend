export const LOAN_MANAGER_ABI = [
  {
    type: "constructor",
    inputs: [
      {
        name: "_lendingPool",
        type: "address",
        internalType: "address",
      },
      {
        name: "_collateralManager",
        type: "address",
        internalType: "address",
      },
      {
        name: "_walletFactory",
        type: "address",
        internalType: "address",
      },
      {
        name: "_usdcToken",
        type: "address",
        internalType: "address",
      },
    ],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "BASIS_POINTS",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "COLLATERAL_RATIO",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "DEFAULT_DURATION",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "DEFAULT_INTEREST_RATE",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "MAX_LOAN_AMOUNT",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "MIN_LOAN_AMOUNT",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "POOL_RATIO",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "borrowerLoans",
    inputs: [
      {
        name: "",
        type: "address",
        internalType: "address",
      },
      {
        name: "",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    outputs: [
      {
        name: "",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "calculateTotalDue",
    inputs: [
      {
        name: "loanId",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    outputs: [
      {
        name: "totalDue",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "collateralManager",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "address",
        internalType: "contract CollateralManager",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getBorrowerLoans",
    inputs: [
      {
        name: "borrower",
        type: "address",
        internalType: "address",
      },
    ],
    outputs: [
      {
        name: "",
        type: "uint256[]",
        internalType: "uint256[]",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getLoanInfo",
    inputs: [
      {
        name: "loanId",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    outputs: [
      {
        name: "",
        type: "tuple",
        internalType: "struct LoanManager.LoanInfo",
        components: [
          {
            name: "borrower",
            type: "address",
            internalType: "address",
          },
          {
            name: "loanAmount",
            type: "uint256",
            internalType: "uint256",
          },
          {
            name: "collateralAmount",
            type: "uint256",
            internalType: "uint256",
          },
          {
            name: "interestRate",
            type: "uint256",
            internalType: "uint256",
          },
          {
            name: "duration",
            type: "uint256",
            internalType: "uint256",
          },
          {
            name: "startTime",
            type: "uint256",
            internalType: "uint256",
          },
          {
            name: "dueDate",
            type: "uint256",
            internalType: "uint256",
          },
          {
            name: "repaidAmount",
            type: "uint256",
            internalType: "uint256",
          },
          {
            name: "restrictedWallet",
            type: "address",
            internalType: "address",
          },
          {
            name: "status",
            type: "uint8",
            internalType: "enum LoanManager.LoanStatus",
          },
        ],
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getLoanStatus",
    inputs: [
      {
        name: "borrower",
        type: "address",
        internalType: "address",
      },
    ],
    outputs: [
      {
        name: "status",
        type: "uint8",
        internalType: "enum LoanManager.LoanStatus",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "hasActiveLoan",
    inputs: [
      {
        name: "borrower",
        type: "address",
        internalType: "address",
      },
    ],
    outputs: [
      {
        name: "hasActive",
        type: "bool",
        internalType: "bool",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "initiateLoan",
    inputs: [
      {
        name: "desiredLoanAmount",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    outputs: [
      {
        name: "loanId",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "lendingPool",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "address",
        internalType: "contract LendingPool",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "loans",
    inputs: [
      {
        name: "",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    outputs: [
      {
        name: "borrower",
        type: "address",
        internalType: "address",
      },
      {
        name: "loanAmount",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "collateralAmount",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "interestRate",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "duration",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "startTime",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "dueDate",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "repaidAmount",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "restrictedWallet",
        type: "address",
        internalType: "address",
      },
      {
        name: "status",
        type: "uint8",
        internalType: "enum LoanManager.LoanStatus",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "nextLoanId",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "owner",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "address",
        internalType: "address",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "renounceOwnership",
    inputs: [],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "repayLoan",
    inputs: [
      {
        name: "loanId",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "repayAmount",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "totalActiveLoans",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "totalDefaultedLoans",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "totalLoansIssued",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "totalLoansRepaid",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "transferOwnership",
    inputs: [
      {
        name: "newOwner",
        type: "address",
        internalType: "address",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "usdcToken",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "address",
        internalType: "contract IERC20",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "walletFactory",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "address",
        internalType: "contract RestrictedWalletFactory",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "event",
    name: "LoanDefaulted",
    inputs: [
      {
        name: "loanId",
        type: "uint256",
        indexed: true,
        internalType: "uint256",
      },
      {
        name: "borrower",
        type: "address",
        indexed: true,
        internalType: "address",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "LoanFullyRepaid",
    inputs: [
      {
        name: "loanId",
        type: "uint256",
        indexed: true,
        internalType: "uint256",
      },
      {
        name: "borrower",
        type: "address",
        indexed: true,
        internalType: "address",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "LoanInitiated",
    inputs: [
      {
        name: "loanId",
        type: "uint256",
        indexed: true,
        internalType: "uint256",
      },
      {
        name: "borrower",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "loanAmount",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
      {
        name: "collateralAmount",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
      {
        name: "restrictedWallet",
        type: "address",
        indexed: false,
        internalType: "address",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "LoanRepaid",
    inputs: [
      {
        name: "loanId",
        type: "uint256",
        indexed: true,
        internalType: "uint256",
      },
      {
        name: "borrower",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "repaidAmount",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
      {
        name: "remainingBalance",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "OwnershipTransferred",
    inputs: [
      {
        name: "previousOwner",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "newOwner",
        type: "address",
        indexed: true,
        internalType: "address",
      },
    ],
    anonymous: false,
  },
  {
    type: "error",
    name: "OwnableInvalidOwner",
    inputs: [
      {
        name: "owner",
        type: "address",
        internalType: "address",
      },
    ],
  },
  {
    type: "error",
    name: "OwnableUnauthorizedAccount",
    inputs: [
      {
        name: "account",
        type: "address",
        internalType: "address",
      },
    ],
  },
  {
    type: "error",
    name: "ReentrancyGuardReentrantCall",
    inputs: [],
  },
  {
    type: "error",
    name: "SafeERC20FailedOperation",
    inputs: [
      {
        name: "token",
        type: "address",
        internalType: "address",
      },
    ],
  },
] as const;

export const LOAN_MANAGER_ADDRESS =
  "0x7364EeB345989C757616988B70976BBa163B7571";
