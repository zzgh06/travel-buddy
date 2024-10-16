import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';

const Navbar = () => {
  const { data: session } = useSession();

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link href="/" className="flex-shrink-0 flex items-center">
              Travel Buddy
            </Link>
          </div>
          <div className="flex items-center">
            {session ? (
              <>
                <Link href="/trips/new" className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
                  New Trip
                </Link>
                <button
                  onClick={() => signOut()}
                  className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Sign out
                </button>
              </>
            ) : (
              <Link href="/api/auth/signin" className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
                Sign in
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;