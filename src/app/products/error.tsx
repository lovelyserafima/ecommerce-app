"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="w-full max-w-7xl mx-auto px-4 py-8 flex flex-col items-center justify-center min-h-[50vh]">
      <h2 className="text-2xl font-bold mb-4">Something went wrong</h2>
      <p className="text-gray-500 mb-6">Failed to load the product catalog. Please try again.</p>
      <button
        onClick={reset}
        className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Try again
      </button>
    </main>
  );
}
