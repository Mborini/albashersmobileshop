import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import ActionsGrid from './Card';

export default async function Dashboard() {
  const cookieStore = await cookies();
  const auth = cookieStore.get('auth');

  if (!auth || auth.value !== 'true') {
    redirect('/signin');
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <ActionsGrid />
    </div>
  );
}
