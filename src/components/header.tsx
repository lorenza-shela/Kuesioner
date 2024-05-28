/* eslint-disable @next/next/no-img-element */
'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Logo from '../../public/icon.png';
import Cookies from 'js-cookie';

function Header() {
  const [isNavbarOpen, setIsNavbarOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Cek apakah pengguna sudah login
    const loggedIn = Cookies.get('nipnuptk') && Cookies.get('password');
    setIsLoggedIn(Boolean(loggedIn));
  }, []);

  const toggleNavbar = () => {
    setIsNavbarOpen(!isNavbarOpen);
  };
  return (
    <>
      <nav className='border-gray-200 bg-white dark:bg-gray-900'>
        <div className='mx-auto flex max-w-screen-xl flex-wrap items-center justify-between p-4'>
          <a href='https://flowbite.com/' className='flex items-center'>
            <Image src={Logo} alt='Flowbite Logo' className='mr-3 h-8 w-8' />
            <span className='self-center whitespace-nowrap text-2xl font-semibold dark:text-white'>PKGP</span>
          </a>
          <button
            onClick={toggleNavbar}
            type='button'
            className='inline-flex h-10 w-10 items-center justify-center rounded-lg p-2 text-sm text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600 md:hidden'
            aria-controls='navbar-default'
            aria-expanded='false'
          >
            <span className='sr-only'>Open main menu</span>
            <svg className='h-5 w-5' aria-hidden='true' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 17 14'>
              <path stroke='currentColor' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M1 1h15M1 7h15M1 13h15' />
            </svg>
          </button>
          <div className={`w-full md:block md:w-auto ${isNavbarOpen ? 'block' : 'hidden'} z-10`} id='navbar-default'>
            <ul className='mt-4 flex flex-col rounded-lg border border-gray-100 bg-gray-50 p-4 font-medium dark:border-gray-700 dark:bg-gray-800 md:mt-0 md:flex-row md:space-x-8 md:border-0 md:bg-white md:p-0 md:dark:bg-gray-900'>
              <li>
                <Link href='#hero' className='block rounded bg-blue-700 py-2 pl-3 pr-4 text-white dark:text-white md:bg-transparent md:p-0 md:text-blue-700 md:dark:text-blue-500' aria-current='page'>
                  Home
                </Link>
              </li>
              <li>
                <Link href='#tutorial'>
                  <span className='block rounded py-2 pl-3 pr-4 text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:border-0 md:p-0 md:hover:bg-transparent md:hover:text-blue-700 md:dark:hover:bg-transparent md:dark:hover:text-blue-500'>
                    Tutorial
                  </span>
                </Link>
              </li>
              <li>
                <Link href='#tentang'>
                  <span className='block rounded py-2 pl-3 pr-4 text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:border-0 md:p-0 md:hover:bg-transparent md:hover:text-blue-700 md:dark:hover:bg-transparent md:dark:hover:text-blue-500'>
                    Tentang
                  </span>
                </Link>
              </li>
              {isLoggedIn ? (
                <li>
                  <Link href='/dashboard'>
                    <span className='block rounded py-2 pl-3 pr-4 text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:border-0 md:p-0 md:hover:bg-transparent md:hover:text-blue-700 md:dark:hover:bg-transparent md:dark:hover:text-blue-500'>
                      Dashboard
                    </span>
                  </Link>
                </li>
              ) : (
                <>
                  <li>
                    <Link href='/login'>
                      <span className='block rounded py-2 pl-3 pr-4 text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:border-0 md:p-0 md:hover:bg-transparent md:hover:text-blue-700 md:dark:hover:bg-transparent md:dark:hover:text-blue-500'>
                        Login
                      </span>
                    </Link>
                  </li>
                  <li>
                    <Link href='/SignUp'>
                      <span className='block rounded py-2 pl-3 pr-4 text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:border-0 md:p-0 md:hover:bg-transparent md:hover:text-blue-700 md:dark:hover:bg-transparent md:dark:hover:text-blue-500'>
                        Daftar
                      </span>
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
}

export default Header;
