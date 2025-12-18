'use client';
import { useState, useEffect } from "react";
import Link from "next/link";

const PrivacyPolicyBar = () => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const isAccepted = localStorage.getItem("privacyPolicyAccepted");
    if (!isAccepted) {
      setIsVisible(true);
    }
  }, []);

  const handleClose = () => {
    localStorage.setItem("privacyPolicyAccepted", "true");
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 w-full bg-gray-900 text-white p-4 flex items-center justify-between z-50">
      <p className="text-sm">
        We value your privacy. Read our{" "}
        <Link href="https://www.termsfeed.com/live/714a7d38-cbd3-42c4-919e-8646ad9f4321" className="underline text-blue-400">
          Privacy Policy
        </Link>
        .
      </p>
      <div className="space-x-4">
        <Link
          href="https://www.termsfeed.com/live/714a7d38-cbd3-42c4-919e-8646ad9f4321"
          className="bg-blue-500 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-600 transition"
        >
          Read More
        </Link>
        <button
          onClick={handleClose}
          className="bg-gray-700 text-white px-4 py-2 rounded-md text-sm hover:bg-gray-600 transition"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default PrivacyPolicyBar;
