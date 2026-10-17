"use client"; // Error components must be Client Components

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="ltr flex h-screen w-full flex-col items-center justify-center gap-4">
      <h2>Something went wrong!</h2>
      <h2 className="text-red-500">500 Error Here</h2>
      <button
        className="rounded-lg bg-grey-300 p-1"
        onClick={
          // Attempt to recover by trying to re-render the segment
          () => reset()
        }
      >
        Try again
      </button>
    </div>
  );
}
