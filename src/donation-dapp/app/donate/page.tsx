import Navbar from "@/components/Navbar";
import DonateButton from "@/components/DonateButton";

export default function DonatePage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-black to-gray-900 text-white">
      <Navbar />
      <DonateButton />
    </main>
  );
}
