import { NextResponse } from "next/server";
import { collection, doc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { additionalOptions } from "@/constants";

export async function POST() {
  try {
    // Iterate over the additionalOptions array and upload each option to Firestore
    const batchPromises = additionalOptions.map(async (option) => {
      // Use the option's `id` as the document ID
      const optionId = option.name; // Ensure the ID is a string
      await setDoc(doc(collection(db, "additionalOptions"), optionId), option);
    });

    // Wait for all uploads to complete
    await Promise.all(batchPromises);

    // Return a success response
    return NextResponse.json(
      { message: "Additional options uploaded successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error uploading additional options:", error);
    return NextResponse.json(
      { error: "Failed to upload additional options" },
      { status: 500 }
    );
  }
}