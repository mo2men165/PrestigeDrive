'use client';
import { createContext, useContext, useState, useEffect, useCallback } from 'react';

interface RentalData {
  pickupLocation: string;
  dropoffLocation: string;
  pickupDate: string | null;
  dropoffDate: string | null;
  pickupTime: string;
  dropoffTime: string;
  basePrice: number;
  totalPrice: number;
  totalDays: number;
  selectedPlan: Record<string, any>;
  carMake: string;
  name: string;
  email: string;
  phone: string;
  dob: string;
  selectedAddons: string;
  addonsCost: number;
  finalTotalPrice: number;
  bookingRef: string;
}

const STORAGE_KEY = 'elitedrive4u-rental-data';

const defaultRentalData: RentalData = {
  pickupLocation: '',
  dropoffLocation: '',
  pickupDate: null,
  dropoffDate: null,
  pickupTime: '12:30',
  dropoffTime: '08:30',
  basePrice: 0,
  totalPrice: 0,
  totalDays: 0,
  selectedPlan: {},
  name: '',
  email: '',
  phone: '',
  dob: '',
  carMake: '',
  selectedAddons: 'None',
  addonsCost: 0,
  finalTotalPrice: 0,
  bookingRef: '',
};

interface RentalContextType {
  rentalData: RentalData;
  setRentalData: (data: RentalData) => void;
  isLoading: boolean;
  setLoading: (loading: boolean) => void;
}

const RentalContext = createContext<RentalContextType | undefined>(undefined);

export const RentalProvider = ({ children }: { children: React.ReactNode }) => {
  const [rentalData, setRentalDataState] = useState<RentalData>(defaultRentalData);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setRentalDataState({ ...defaultRentalData, ...JSON.parse(stored) });
      }
    } catch {
      // Ignore parse errors
    }
  }, []);

  const setRentalData = useCallback((data: RentalData) => {
    setRentalDataState(data);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch {
      // Ignore storage errors
    }
  }, []);

  return (
    <RentalContext.Provider value={{ rentalData, setRentalData, isLoading, setLoading }}>
      {children}
    </RentalContext.Provider>
  );
};

export const useRentalData = () => {
  const context = useContext(RentalContext);
  if (!context) {
    throw new Error('useRentalData must be used within a RentalProvider');
  }
  return context;
};
