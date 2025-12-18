"use client";

import { error } from "@/public/assets";
import Image from "next/image";
import Link from "next/link";

export default function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center my-16 p-12">
      <Image
        src={error}
        alt="Page Not Found"
        width={800}
        height={600}
        className="max-w-full h-auto"
      />
      <Link
        href="/"
        className="mt-6 px-6 py-3 text-lg font-semibold text-white bg-primary rounded-xl shadow-lg transition-transform hover:scale-105"
      >
        Back to Home
      </Link>
    </div>
  );
}
