/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { FaBars, FaTimes, FaChevronDown, FaSpinner } from 'react-icons/fa'

const Navbar = () => {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)

  const handleSignIn = () => {
    router.push('/login')
  }

  const handleSignOut = async () => {
    await signOut({ redirect: false })
    router.push('/')
    router.refresh()
  }

  return (
    <nav className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="text-2xl font-bold">
                🌏 Travel Buddy
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link href="/" className="text-gray-900 inline-flex items-center px-1 hover:text-green-700 text-[17px] font-semibold">
                홈
              </Link>
              <Link href="/planner" className="text-gray-900 inline-flex items-center px-1 hover:text-green-700 text-[17px] font-semibold">
                여행 계획
              </Link>
              {status === 'authenticated' && (
                <Link href="/profile" className="text-gray-900 inline-flex items-center px-1 hover:text-green-700 text-[17px] font-semibold">
                  프로필
                </Link>
              )}
            </div>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            {status === 'unauthenticated' ? (
              <button
                data-cy="login-button"
                onClick={handleSignIn}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                로그인
              </button>
            ) : status === 'authenticated' ? (
              <div className="ml-3 relative">
                <div>
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="bg-white rounded-full flex text-sm"
                    id="user-menu"
                    data-cy="user-menu"
                  >
                    <FaChevronDown className="ml-1 h-5 w-5 text-gray-400" aria-hidden="true" />
                  </button>
                </div>
                {dropdownOpen && (
                  <div
                    className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
                    role="menu"
                  >
                    <Link
                      href="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      role="menuitem"
                    >
                      프로필
                    </Link>
                    <button
                      onClick={handleSignOut}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      role="menuitem"
                      data-cy="logout-button"
                    >
                      로그아웃
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                disabled
              >
                <FaSpinner className="animate-spin mr-2 h-5 w-5" />
                로딩 중...
              </button>
            )}
          </div>
          <div className="-mr-2 flex items-center sm:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? (
                <FaTimes className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <FaBars className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="sm:hidden" id="mobile-menu">
          <div className="pt-2 pb-3 space-y-1">
            <Link href="/" className="text-gray-600 hover:bg-gray-50 hover:text-gray-900 block px-3 py-2 rounded-md text-base font-medium">
              홈
            </Link>
            <Link href="/planner" className="text-gray-600 hover:bg-gray-50 hover:text-gray-900 block px-3 py-2 rounded-md text-base font-medium">
              여행 계획
            </Link>
            {status === 'authenticated' && (
              <Link href="/profile" className="text-gray-600 hover:bg-gray-50 hover:text-gray-900 block px-3 py-2 rounded-md text-base font-medium">
                프로필
              </Link>
            )}
          </div>
          <div className="pt-4 pb-3 border-t border-gray-200">
            {status === 'unauthenticated' ? (
              <div className="mt-3 space-y-1">
                <button
                  onClick={handleSignIn}
                  className="block w-full text-left px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100"
                >
                  로그인
                </button>
              </div>
            ) : status === 'authenticated' ? (
              <div className="mt-3 space-y-1">
                <button
                  onClick={handleSignOut}
                  className="block w-full text-left px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100"
                >
                  로그아웃
                </button>
              </div>
            ) : (
              <button
                className="flex items-center w-full text-left px-4 py-2 text-base font-medium text-gray-500"
                disabled
              >
                <FaSpinner className="animate-spin mr-2 h-5 w-5" />
                로딩 중...
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar