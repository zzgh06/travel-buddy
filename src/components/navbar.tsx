"use client"

import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { FaBars, FaTimes, FaChevronDown, FaSpinner } from 'react-icons/fa'

const Navbar = () => {
  const { status } = useSession()
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10
      setScrolled(isScrolled)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleSignIn = () => {
    router.push('/login')
  }

  const handleSignOut = async () => {
    await signOut({ redirect: false })
    router.push('/')
    router.refresh()
  }

  return (
    <nav className={`fixed left-1/2 -translate-x-1/2 w-full max-w-[800px] transition-all duration-300 z-50
      ${scrolled
        ? 'bg-gray-50 shadow-lg'
        : 'bg-white shadow-sm'
      }`}>
      <div className="h-[60px] flex items-center justify-between px-5">
        <div className="flex items-center">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-2xl">🌏</span>
            <span className={`font-bold text-xl text-black ${scrolled ? 'opacity-100' : 'opacity-90'
              }`}>
              Travel Buddy
            </span>
          </Link>
          <div className="hidden sm:flex sm:items-center sm:ml-6 sm:space-x-6 h-full">
            <Link href="/" className="relative group h-full flex items-center">
              <span className="text-gray-900 inline-flex items-center px-1 text-base font-medium transition-colors duration-200 hover:text-indigo-600">
                홈
              </span>
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200" />
            </Link>
            <Link href="/planner" data-cy="travel-planner-page" className="relative group h-full flex items-center">
              <span className="text-gray-900 inline-flex items-center px-1 text-base font-medium transition-colors duration-200 hover:text-indigo-600">
                여행 계획
              </span>
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200" />
            </Link>
          </div>
        </div>

        <div className="hidden sm:flex sm:items-center">
          {status === 'unauthenticated' ? (
            <button
              data-cy="login-button"
              onClick={handleSignIn}
              className="inline-flex items-center px-4 py-1.5 border border-transparent text-sm font-medium rounded-full text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              로그인
            </button>
          ) : status === 'authenticated' ? (
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="bg-white/80 backdrop-blur-sm rounded-full p-1.5 flex items-center space-x-2 hover:bg-gray-100 transition-colors duration-200"
                id="user-menu"
                data-cy="user-menu"
              >
                <div className="w-7 h-7 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600" />
                <FaChevronDown className="ml-1 h-5 w-5 text-gray-400" aria-hidden="true" />
              </button>
              {dropdownOpen && (
                <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-xl shadow-lg py-1 bg-white/80 backdrop-blur-md ring-1 ring-black ring-opacity-5 focus:outline-none transform transition-all duration-200">
                  <button
                    onClick={handleSignOut}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700"
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
              className="inline-flex items-center px-4 py-1.5 border border-transparent text-sm font-medium rounded-full text-white bg-gradient-to-r from-indigo-600 to-purple-600"
              disabled
            >
              <FaSpinner className="animate-spin mr-2 h-4 w-4" />
              로딩 중...
            </button>
          )}
        </div>

        <div className="flex items-center sm:hidden">
          <button
            onClick={() => setIsOpen(!isOpen)}
            type="button"
            className="inline-flex items-center justify-center p-2 rounded-lg text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 transition-colors duration-200"
          >
            <span className="sr-only">Open main menu</span>
            {isOpen ? (
              <FaTimes className="block h-5 w-5" aria-hidden="true" />
            ) : (
              <FaBars className="block h-5 w-5" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="sm:hidden w-full border rounded-b-lg bg-gray-50 mt-2" id="mobile-menu">
          <div className="pt-2 pb-3 space-y-1">
            <Link href="/" className="text-gray-600 hover:bg-gray-100 hover:text-indigo-600 block px-3 py-2 rounded-lg text-base font-medium transition-colors duration-200">
              홈
            </Link>
            <Link href="/planner" data-cy="travel-planner-page" className="text-gray-600 hover:bg-gray-100 hover:text-indigo-600 block px-3 py-2 rounded-lg text-base font-medium transition-colors duration-200">
              여행 계획
            </Link>
          </div>
          <div className="pt-4 pb-3 border-t border-gray-200">
            {status === 'unauthenticated' ? (
              <div className="mt-3 space-y-1">
                <button
                  onClick={handleSignIn}
                  className="block w-full text-left px-4 py-2 text-base font-medium text-gray-500 hover:text-indigo-600 hover:bg-gray-100 transition-colors duration-200"
                >
                  로그인
                </button>
              </div>
            ) : status === 'authenticated' ? (
              <div className="mt-3 space-y-1">
                <button
                  onClick={handleSignOut}
                  className="block w-full text-left px-4 py-2 text-base font-medium text-gray-500 hover:text-indigo-600 hover:bg-gray-100 transition-colors duration-200"
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
      )
      }
    </nav >
  )
}

export default Navbar