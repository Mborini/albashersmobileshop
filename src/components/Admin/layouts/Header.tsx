import Link from "next/link";

export default function AdminHeader() {
  return (
    <header className="bg-gray-2 text-dark p-4">
      <nav className="flex gap-4">
        <Link href="/(admin)/dashboard">Dashboard</Link>
        <Link href="/">Go to Site</Link>
      </nav>
    </header>
  );
}
