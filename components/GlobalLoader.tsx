'use client';
import { useEffect, useState } from "react";
import { useRentalData } from "@/contexts/RentalContext";
import { PropagateLoader } from "react-spinners";

const GlobalLoader = () => {
  const { isLoading } = useRentalData();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    if (isLoading) {
      setVisible(true); // Show loader immediately
    } else {
      timeout = setTimeout(() => {
        setVisible(false); // Hide loader after fade-out delay
      }, 700); // 0.7s fade-out duration
    }

    return () => clearTimeout(timeout); // Cleanup timeout on unmount
  }, [isLoading]);

  if (!visible) return null; // Prevent rendering when loader is fully hidden

  return (
    <div
      className={`fixed inset-0 flex flex-col items-center justify-center bg-white z-50 
        transition-opacity duration-700 ${isLoading ? "opacity-100" : "opacity-0"}`}
    >
      <PropagateLoader color="#1B365D" size={15} />
      <p className="mt-4 text-lg font-semibold text-primary">Loading...</p>
    </div>
  );
};

export default GlobalLoader;
