import React, { useEffect, useState } from "react";
import { Clock } from "lucide-react";

export default function AutoReleaseTimer({ autoReleaseAt, isBuyer }) {
  const [timeLeft, setTimeLeft] = useState("");
  const [expired, setExpired] = useState(false);

  useEffect(() => {
    const update = () => {
      const now = Date.now();
      const end = new Date(autoReleaseAt).getTime();
      const diff = end - now;
      if (diff <= 0) {
        setExpired(true);
        setTimeLeft("00:00:00");
        return;
      }
      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setTimeLeft(
        `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`
      );
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [autoReleaseAt]);

  return (
    <div className={`rounded-2xl p-5 mb-4 border ${expired ? "bg-green-50 border-green-200" : isBuyer ? "bg-amber-50 border-amber-200" : "bg-blue-50 border-blue-200"}`}>
      <div className="flex items-center gap-3 mb-2">
        <Clock className={`w-5 h-5 ${expired ? "text-green-500" : isBuyer ? "text-amber-500" : "text-blue-500"}`} />
        <span className={`font-bold text-sm ${expired ? "text-green-800" : isBuyer ? "text-amber-800" : "text-blue-800"}`}>
          {expired ? "Auto-Release Triggered" : isBuyer ? "Confirm Delivery Within:" : "Auto-Release Countdown:"}
        </span>
      </div>
      {!expired && (
        <div className={`text-4xl font-black tracking-widest ${isBuyer ? "text-amber-700" : "text-blue-700"}`}>
          {timeLeft}
        </div>
      )}
      <p className={`text-xs mt-2 ${expired ? "text-green-700" : isBuyer ? "text-amber-700" : "text-blue-600"}`}>
        {expired
          ? "Funds have been automatically released to the seller."
          : isBuyer
          ? "If you don't confirm or dispute within this time, funds will be automatically released to the seller."
          : "Funds will be automatically released to your wallet when this timer expires, if no dispute is raised."}
      </p>
    </div>
  );
}