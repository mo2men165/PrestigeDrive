import { collection, addDoc } from "firebase/firestore";
import { carsData } from "./constants";
import { db } from "./lib/firebase";


const uploadData = async () => {
  try {
    for (const car of carsData) {
      await addDoc(collection(db, "cars"), car);
    }
    
    console.log("Data uploaded successfully!");
  } catch (error) {
    console.error("Error uploading data:", error);
  }
};

uploadData();
