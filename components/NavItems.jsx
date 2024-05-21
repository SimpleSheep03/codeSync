import Link from 'next/link'
import React from 'react'

const NavItems = () => {
  return (
    <div>
        <Link href='/'>
            <span>Sign In</span>
        </Link>
    </div>
  )
}

export default NavItems