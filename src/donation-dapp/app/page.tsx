"use client";
import React, { useState, useEffect } from "react";
import DonateButton from "@/components/DonateButton";

// ===== Các icon + data mẫu (giữ nguyên code bạn đã có ở đây)
const STATIC_TOTAL = "15,842.12";
const STATIC_DONORS = [
  { id: 1, address: "0x1A2b...E5F6", amount: "3,100 CFLR" },
  { id: 2, address: "0x7C8d...B9A0", amount: "500 CFLR" },
  { id: 3, address: "0x3X4Y...9H0J", amount: "100.5 CFLR" },
  { id: 4, address: "0xP9QZ...2K3L", amount: "5,000 CFLR" },
];
const STATIC_HISTORY = [
  { txHash: "0xfa12...9d0f", from: "0x1A2b...E5F6", amount: "3.1", currency: "CFLR", time: "1 phút trước" },
  { txHash: "0x0c9e...5b3a", from: "0x7C8d...B9A0", amount: "0.5", currency: "CFLR", time: "5 phút trước" },
  { txHash: "0x4b7f...2a1c", from: "0x3X4Y...9H0J", amount: "100.5", currency: "CFLR", time: "1 giờ trước" },
  { txHash: "0x2d5h...8g9i", from: "0xP9QZ...2K3L", amount: "5.0", currency: "CFLR", time: "2 giờ trước" },
  { txHash: "0x8e6k...4l5m", from: "0xR0ST...6U7V", amount: "12.0", currency: "CFLR", time: "Hôm qua" },
];

// ===== Navbar, StatsSection, HistorySection (giữ nguyên code bạn đã viết)
const Navbar = ({ account, connectWallet }) => {
  return (
    <nav className="bg-gray-800 p-4 shadow-lg sticky top-0 z-10 border-b border-blue-800">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <span className="flex items-center space-x-2 text-white">
          <span className="text-xl font-bold tracking-wider">💎 DeDonate</span>
          <span className="text-xs text-gray-400 border border-gray-600 px-1 rounded">Coston Testnet</span>
        </span>
        {!account ? (
          <button onClick={connectWallet} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-full">
            🔗 Kết nối Ví
          </button>
        ) : (
          <div className="bg-gray-700 p-2 rounded-full text-sm border border-blue-500">
            {account.slice(0, 6)}...{account.slice(-4)}
          </div>
        )}
      </div>
    </nav>
  );
};

const StatsSection = () => (
  <section className="bg-gray-800 p-6 rounded-2xl border border-blue-700/50">
    <h2 className="text-xl font-bold text-white mb-2">Tổng Tiền Quyên Góp (Test)</h2>
    <p className="text-4xl text-green-400 font-extrabold">{STATIC_TOTAL}</p>
    <p className="text-sm text-gray-400 mb-4">CFLR (Coston Testnet)</p>
    <h3 className="text-lg text-white mb-2">Top Người Quyên Góp</h3>
    <ul className="space-y-2">
      {STATIC_DONORS.map((d) => (
        <li key={d.id} className="flex justify-between text-sm text-gray-300">
          <span>{d.address}</span> <span className="text-green-300">{d.amount}</span>
        </li>
      ))}
    </ul>
  </section>
);

const HistorySection = () => (
  <section className="bg-gray-800 p-6 rounded-2xl border border-blue-700/50 mt-10">
    <h2 className="text-xl font-bold text-white mb-4">Lịch Sử Giao Dịch (Test)</h2>
    <div className="overflow-x-auto">
      <table className="min-w-full text-sm text-gray-300">
        <thead className="text-gray-400 border-b border-gray-700">
          <tr>
            <th className="px-4 py-2 text-left">Thời gian</th>
            <th className="px-4 py-2 text-left">Người quyên góp</th>
            <th className="px-4 py-2 text-right">Số lượng</th>
            <th className="px-4 py-2 text-right">Tx Hash</th>
          </tr>
        </thead>
        <tbody>
          {STATIC_HISTORY.map((tx) => (
            <tr key={tx.txHash} className="border-b border-gray-700 hover:bg-gray-700/50">
              <td className="px-4 py-2">{tx.time}</td>
              <td className="px-4 py-2">{tx.from}</td>
              <td className="px-4 py-2 text-right text-green-300 font-bold">
                {tx.amount} {tx.currency}
              </td>
              <td className="px-4 py-2 text-right">
                <a
                  href={`https://coston-explorer.flare.network/tx/${tx.txHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300"
                >
                  {tx.txHash.slice(0, 6)}...
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </section>
);

// ===== Trang chính
export default function Home() {
  const [account, setAccount] = useState(null);

  async function connectWallet() {
    if (!window.ethereum) {
      alert("Vui lòng cài MetaMask!");
      return;
    }
    const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
    setAccount(accounts[0]);
  }

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.request({ method: "eth_accounts" }).then((accs) => {
        if (accs.length > 0) setAccount(accs[0]);
      });
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans">
      <Navbar account={account} connectWallet={connectWallet} />
      <main className="max-w-7xl mx-auto p-8 grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <DonateButton />
        </div>
        <div>
          <StatsSection />
        </div>
      </main>
      <div className="max-w-7xl mx-auto p-8">
        <HistorySection />
      </div>
    </div>
  );
}
