'use client';

import { useEffect, useState } from 'react';
import { useRentalData } from '@/contexts/RentalContext';

const GlobalLoader = () => {
  const { isLoading } = useRentalData();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    if (isLoading) {
      setVisible(true);
    } else {
      timeout = setTimeout(() => setVisible(false), 600);
    }

    return () => clearTimeout(timeout);
  }, [isLoading]);

  if (!visible) return null;

  return (
    <div
      className={`fixed inset-0 flex flex-col items-center justify-center bg-white z-50 
        transition-opacity duration-600 ${isLoading ? 'opacity-100' : 'opacity-0'}`}
    >
      <div className="flex gap-1.5">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse"
            style={{ animationDelay: `${i * 150}ms` }}
          />
        ))}
      </div>
      <p className="mt-4 text-sm font-medium text-gray-400">Loading...</p>
    </div>
  );
};

export default GlobalLoader;
