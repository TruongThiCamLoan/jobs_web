"use client";
import React, { useState } from "react";
import { ethers } from "ethers";
import { CONTRACT_ADDRESS, CONTRACT_ABI, COSTON_NETWORK_PARAMS } from "@/lib/contractConfig";

export default function DonateButton() {
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);

const handleDonate = async () => {
  try {
    if (!window.ethereum) {
      alert("⚠️ Vui lòng cài đặt MetaMask!");
      return;
    }

    // 1️⃣ Kết nối ví
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();

    // 2️⃣ Kiểm tra mạng hiện tại
    const network = await provider.getNetwork();
    console.log("Network connected:", network.chainId.toString());

    // Nếu mạng khác Coston (chainId = 16 hoặc 19), báo lỗi
    if (network.chainId !== 19n && network.chainId !== 16n) {
      alert("⚠️ Vui lòng chuyển sang mạng Coston hoặc Songbird testnet!");
      return;
    }

    // 3️⃣ Tạo contract
    const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

    // 4️⃣ Thực hiện donate
    const amountInEth = "0.1"; // thử gửi 0.1 CLFR
    console.log("Gửi:", amountInEth, "CLFR tới", CONTRACT_ADDRESS);

    const tx = await contract.donate({
      value: ethers.parseEther(amountInEth),
    });

    console.log("⏳ Đang chờ xác nhận giao dịch...", tx.hash);
    await tx.wait();

    alert("🎉 Giao dịch thành công!");
  } catch (err: any) {
    console.error("Lỗi giao dịch:", err);

    // Thêm thông tin lỗi chi tiết
    alert("❌ Giao dịch thất bại: " + (err.reason || err.message || "Không rõ nguyên nhân"));
  }
};

  return (
    <div className="bg-gray-800 p-6 rounded-2xl border border-blue-700/50">
      <h2 className="text-xl font-bold mb-3 text-white">Quyên góp (CLFR)</h2>
      <input
        type="number"
        placeholder="Nhập số lượng CLFR..."
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        className="w-full p-2 rounded bg-gray-700 text-white mb-4"
      />
      <button
        onClick={handleDonate}
        disabled={loading || !amount}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition"
      >
        {loading ? "Đang xử lý..." : "Gửi quyên góp 💎"}
      </button>
    </div>
  );
}
