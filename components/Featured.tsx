'use client';
import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase"; // Ensure Firebase is properly initialized
import Card from "./Card";
import { useRentalData } from "@/contexts/RentalContext";
import { Car } from "@/types/types";

const Featured = () => {
  const [cars, setCars] = useState<Car[]>([]); 
  const { isLoading, setLoading } = useRentalData();
  
  useEffect(() => {
    const fetchCars = async () => {
      setLoading(true);
      try {
        const querySnapshot = await getDocs(collection(db, "cars"));
        const carsList: Car[] = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Car[];

        setCars(carsList.slice(0, 3));
      } catch (error) {
        console.error("Error fetching cars:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCars();
  }, [setLoading]);


  return (
    <section className="my-16">
    <h2 className="text-4xl font-sans font-bold text-center uppercase mt-12 mb-6">
      Our most popular cars
    </h2>
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-6">
      {cars.map((car) => (
        <Card key={car.id} {...car} />
      ))}
    </div>
  </section>
  );
};

export default Featured;
