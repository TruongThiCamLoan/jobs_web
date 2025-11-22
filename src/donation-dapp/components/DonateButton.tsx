"use client";
import { useState, useEffect } from "react";

// ===== Cấu hình mạng COSTON TESTNET (Songbird)
const DONATION_ADDRESS = "0x86c0ef4D611759979C324BbA2a4476A7d75AceD9"; 
const COSTON_CHAIN_ID = "0x10"; // 16 dạng hex

const COSTON_NETWORK_PARAMS = {
  chainId: COSTON_CHAIN_ID,
  chainName: "Songbird Testnet Coston",
  nativeCurrency: { name: "Coston Flare", symbol: "CFLR", decimals: 18 },
  rpcUrls: ["https://coston-api.flare.network/ext/C/rpc"],
  blockExplorerUrls: ["https://coston-explorer.flare.network"],
};

// ===== Hàm đổi định dạng giữa CFLR ↔ Wei
function toWeiHex(amount: string) {
  const value = parseFloat(amount);
  if (isNaN(value) || value <= 0) return "0x0";
  const wei = BigInt(Math.floor(value * 1_000_000_000_000_000_000));
  return "0x" + wei.toString(16);
}

function fromWeiHex(weiHex: string) {
  try {
    const wei = BigInt(weiHex);
    const eth = Number(wei) / 1_000_000_000_000_000_000;
    return eth.toFixed(4);
  } catch {
    return "0.0";
  }
}

// ===== Component chính
export default function DonateButton() {
  const [account, setAccount] = useState<string | null>(null);
  const [amount, setAmount] = useState("");
  const [balance, setBalance] = useState("0.0");
  const [isLoading, setIsLoading] = useState(false);
  const [isBalanceLoading, setIsBalanceLoading] = useState(false);

  // 🧩 Kết nối ví
  async function connectWallet() {
    if (!window.ethereum) {
      alert("Vui lòng cài MetaMask!");
      return;
    }
    const isSwitched = await switchNetwork();
    if (!isSwitched) return;

    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    setAccount(accounts[0]);
  }

  // 🔄 Chuyển hoặc thêm mạng COSTON
  async function switchNetwork() {
    if (!window.ethereum) return false;
    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: COSTON_CHAIN_ID }],
      });
      return true;
    } catch (error: any) {
      if (error.code === 4902) {
        try {
          await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [COSTON_NETWORK_PARAMS],
          });
          return true;
        } catch (addError) {
          console.error("Không thể thêm mạng Coston:", addError);
          alert("❌ Thêm mạng Songbird Testnet Coston thủ công trong MetaMask.");
          return false;
        }
      }
      console.error("Lỗi khi chuyển mạng:", error);
      alert("❌ Chuyển thủ công sang mạng Songbird Testnet Coston.");
      return false;
    }
  }

  // 💰 Lấy số dư ví hiện tại
  async function fetchBalance() {
    if (!window.ethereum || !account) return;
    setIsBalanceLoading(true);
    try {
      const balanceWeiHex = await window.ethereum.request({
        method: "eth_getBalance",
        params: [account, "latest"],
      });
      setBalance(fromWeiHex(balanceWeiHex));
    } catch (error) {
      console.error("Lỗi khi lấy số dư:", error);
      setBalance("Lỗi");
    } finally {
      setIsBalanceLoading(false);
    }
  }

  // 💸 Gửi giao dịch quyên góp
  async function donate() {
    if (!window.ethereum || !account) {
      alert("Vui lòng kết nối ví trước.");
      return;
    }
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      alert("Nhập số CFLR hợp lệ");
      return;
    }

    setIsLoading(true);
    try {
      const isSwitched = await switchNetwork();
      if (!isSwitched) throw new Error("Chưa ở đúng mạng Songbird Testnet Coston");

      const txHash = await window.ethereum.request({
        method: "eth_sendTransaction",
        params: [
          {
            from: account,
            to: DONATION_ADDRESS,
            value: toWeiHex(amount),
            gas: "0x1D4C0", // 120000 gas
          },
        ],
      });

      alert(`✅ Giao dịch thành công!\nTx hash: ${txHash}`);
      setAmount("");
      setTimeout(fetchBalance, 3000);
    } catch (error: any) {
      console.error("Lỗi giao dịch:", error);
      alert(`❌ Lỗi giao dịch: ${error.message || "Kiểm tra console"}`);
    } finally {
      setIsLoading(false);
    }
  }

  // Lấy số dư khi có account
  useEffect(() => {
    if (account) fetchBalance();
  }, [account]);

  // Theo dõi thay đổi tài khoản trong MetaMask
  useEffect(() => {
    if (window.ethereum) {
      const handleAccountsChanged = (accs: string[]) => {
        setAccount(accs.length > 0 ? accs[0] : null);
      };
      window.ethereum.on("accountsChanged", handleAccountsChanged);
      return () => {
        window.ethereum.removeListener("accountsChanged", handleAccountsChanged);
      };
    }
  }, []);

  return (
    <div className="bg-gray-800 p-6 rounded-2xl border border-blue-700/50 shadow-2xl">
      <h2 className="text-2xl font-bold text-white mb-4">💸 Quyên góp ngay</h2>

      {!account ? (
        <button
          onClick={connectWallet}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition"
        >
          🔗 Kết nối ví MetaMask
        </button>
      ) : (
        <>
          <p className="text-sm text-gray-400 mb-3">
            Ví của bạn: <span className="text-blue-400">{account.slice(0, 6)}...{account.slice(-4)}</span>
          </p>
          <p className="text-sm text-yellow-400 mb-4">
            {isBalanceLoading ? "Đang tải số dư..." : `Số dư: ${balance} CFLR`}
          </p>

          <div className="flex gap-2">
            <input
              type="number"
              placeholder="Nhập số CFLR"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="flex-1 bg-gray-700 text-white p-3 rounded-xl border border-gray-600 placeholder-gray-400"
              disabled={isLoading}
            />
            <button
              onClick={donate}
              disabled={isLoading}
              className={`px-6 py-3 rounded-xl font-bold ${
                isLoading
                  ? "bg-gray-600 cursor-not-allowed"
                  : "bg-green-600 hover:bg-green-500 text-white"
              }`}
            >
              {isLoading ? "Đang gửi..." : "Gửi"}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
    