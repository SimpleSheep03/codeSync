'use client'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { signIn, signOut, useSession, getProviders } from 'next-auth/react'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'

const NavItems = () => {
  const { data: session } = useSession()
  const [providers, setProviders] = useState()
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false)
  const profileImage = session?.user?.image
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    const setAuthProviders = async () => {
      if (!session) { // Check if session is falsy before fetching providers
        try {
          const res = await getProviders()
          setProviders(res)
        } catch (error) {
          console.log(error)
        }
      }
    }

    setAuthProviders()
  }, [session])

  return (
    <div className="flex items-center space-x-4">
      {pathname !== '/' && (
        <Link href='/'>
          <button className='bg-gray-100 px-3 text-blue-700 rounded-xl py-1 border-[3px] hover:border-pink-300 hover:text-blue-900'>
            Home
          </button>
        </Link>
      )}

      {!session && (
        <>
          {providers && Object.values(providers).map((provider, index) => (
            <button
              className='bg-gray-100 px-3 text-blue-700 rounded-xl py-1 border-[3px] hover:border-pink-300 hover:text-blue-900'
              key={index}
              onClick={() => {signIn(provider.id)}}
            >
              Sign In
            </button>
          ))}
        </>
      )}

      {session && (
        <div>
          <div className='relative ml-3'>
            <button
              type='button'
              className='relative flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800'
              id='user-menu-button'
              aria-expanded={isProfileMenuOpen}
              aria-haspopup='true'
              onClick={() => setIsProfileMenuOpen((prev) => !prev)}
            >
              <span className='absolute -inset-1.5'></span>
              <span className='sr-only'>Open user menu</span>
              <Image
                className='h-8 w-8 rounded-full'
                src={profileImage || '/path/to/default/profile/image'} // Use your default profile image path
                alt=''
                width={40}
                height={40}
              />
            </button>

            {isProfileMenuOpen && (
              <div
                id='user-menu'
                className='absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-gray-100 py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none'
                role='menu'
                aria-orientation='vertical'
                aria-labelledby='user-menu-button'
                tabIndex='-1'
              >
                <Link
                  href='/profile'
                  className='block px-4 py-2 text-sm text-gray-700'
                  role='menuitem'
                  tabIndex='-1'
                  id='user-menu-item-0'
                  onClick={() => {
                    setIsProfileMenuOpen(false)
                  }}
                >
                  Your Profile
                </Link>
                <Link
                  href={`/contest/with/${session?.user?.id}`}
                  className='block px-4 py-2 text-sm text-gray-700'
                  role='menuitem'
                  tabIndex='-1'
                  id='user-menu-item-1'
                  onClick={() => {
                    setIsProfileMenuOpen(false)
                  }}
                >
                  Contests
                </Link>
                <Link
                  href={`/add-team`}
                  className='block px-4 py-2 text-sm text-gray-700'
                  role='menuitem'
                  tabIndex='-1'
                  id='user-menu-item-1'
                  onClick={() => {
                    setIsProfileMenuOpen(false)
                  }}
                >
                  Add Team
                </Link>
                <button
                  onClick={() => {
                    setIsProfileMenuOpen(false)
                    signOut()
                  }}
                  className='block px-4 py-2 text-sm text-gray-700'
                  role='menuitem'
                  tabIndex='-1'
                  id='user-menu-item-2'
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default NavItems
