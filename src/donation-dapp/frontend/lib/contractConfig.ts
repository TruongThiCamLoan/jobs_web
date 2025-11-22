export const CONTRACT_ADDRESS = "0xb5D36f51D92427D3132635E691a4C01f1F992F4c";

export const CONTRACT_ABI = [
  {
    "inputs": [],
    "name": "donate",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getBalance",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "owner",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "totalDonations",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "withdraw",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];

export const COSTON_NETWORK_PARAMS = {
  chainId: "0x13", // 19 thập phân = 0x13
  chainName: "Coston Testnet",
  nativeCurrency: {
    name: "Coston Flare",
    symbol: "CFLR", // hoặc CLFR nếu explorer hiển thị như vậy
    decimals: 18,
  },
  rpcUrls: ["https://coston-api.flare.network/ext/C/rpc"],
  blockExplorerUrls: ["https://coston-explorer.flare.network/"],
};
