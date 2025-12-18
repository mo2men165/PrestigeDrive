'use client';
import { createContext, useContext, useState } from 'react';

interface RentalData {
  pickupLocation: string;
  dropoffLocation: string;
  pickupDate: Date | any;
  dropoffDate: Date | any;
  pickupTime: string;
  dropoffTime: string;
  basePrice: number;
  vat: number;
  totalPrice: number;
  discountAmount: number;
  valueAfterDiscount: number;
  hasDiscount: boolean;
  valueBeforeDiscount: number;
  totalDays: number;
  selectedPlan: object | any;
  carMake: string;
  name: string;
  email: string;
  phone: string;
  dob: string;
}

interface RentalContextType {
  rentalData: RentalData;
  setRentalData: (data: RentalData) => void;
  isLoading: boolean;  // ✅ Add loading state
  setLoading: (loading: boolean) => void; 
}

const RentalContext = createContext<RentalContextType | undefined>(undefined);

export const RentalProvider = ({ children }: { children: React.ReactNode }) => {
  const [rentalData, setRentalData] = useState<RentalData>({
    pickupLocation: '',
    dropoffLocation: '',
    pickupDate: null,
    dropoffDate: null,
    pickupTime: '12:30',
    dropoffTime: '08:30',
    basePrice: 0,
    vat: 0,
    totalPrice: 0,
    discountAmount: 0,
    valueAfterDiscount: 0,
    hasDiscount: false,
    valueBeforeDiscount: 0,
    totalDays: 0,
    selectedPlan: {},
    name: "",
    email: "",
    phone: "",
    dob: "",
    carMake: ""
  });

  const [isLoading, setLoading] = useState(true);


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
