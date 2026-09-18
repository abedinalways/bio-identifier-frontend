'use client';

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col items-center justify-center p-4">
        <h2 className="text-xl font-semibold mb-4">Something went wrong!</h2>
        <button
          onClick={() => reset()}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-md font-medium"
        >
          Try again
        </button>
      </body>
    </html>
  );
}
