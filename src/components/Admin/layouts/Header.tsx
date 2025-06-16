import Link from 'next/link';

export default function AdminHeader() {
  return (
    <header className="bg-blue-900 p-4 shadow-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Empty box to distribute space */}
        <div className="flex-1" />

        {/* Centered title */}
        <h2
          className="flex-1 text-center text-dark font-extrabold select-none"
          style={{ userSelect: 'none' }}
        >
          Management System
        </h2>

        {/* Right links */}
        <div className="flex flex-1 justify-end gap-6">
          <Link href="/dashboard" legacyBehavior passHref>
            <span
              className="text-dark font-medium no-underline cursor-pointer transition-colors duration-150 hover:text-blue-300 hover:underline"
            >
              Dashboard
            </span>
          </Link>
          <Link href="/" legacyBehavior passHref>
            <span
              className="text-dark font-medium no-underline cursor-pointer transition-colors duration-150 hover:text-blue-300 hover:underline"
            >
              Go to Website
                          </span>
          </Link>
        </div>
      </div>
    </header>
  );
}
