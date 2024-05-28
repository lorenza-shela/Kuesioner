import { useState } from 'react';
import Link from 'next/link';
import { FiChevronRight } from 'react-icons/fi';
import { FaRankingStar } from 'react-icons/fa6';

function DropdownMenu() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => setIsOpen(!isOpen);

  return (
    <li className='w-full'>
      <div className='relative w-full'>
        <button onClick={toggleDropdown} className='group flex w-full items-center rounded-lg p-2 text-white hover:bg-gray-700 focus:outline-none'>
          <svg className='h-5 w-5  text-gray-400 transition duration-75 group-hover:text-white' aria-hidden='true' xmlns='http://www.w3.org/2000/svg' fill='currentColor' viewBox='0 0 20 18'>
            <FaRankingStar />
          </svg>

          <span className='ml-3 whitespace-nowrap'>Indeks</span>
        </button>
        {isOpen && (
          <div className='left-0 mt-2 block w-48 rounded-md bg-transparent '>
            <div className='py-1' role='menu' aria-orientation='vertical' aria-labelledby='options-menu'>
              <Link href='/indeksSekolah' className='ml-2 block w-full px-4 py-2 text-base font-semibold text-white hover:bg-gray-100 hover:text-gray-900' role='menuitem'>
                <div className='flex items-center'>
                  <FiChevronRight className='mr-2 text-lg' />
                  Sekolah
                </div>
              </Link>
              <Link href='/indeksGuru' className='ml-2 block w-full px-4 py-2 text-base font-semibold text-white hover:bg-gray-100 hover:text-gray-900' role='menuitem'>
                <div className='flex items-center'>
                  <FiChevronRight className='mr-2 text-lg' />
                  Guru
                </div>
              </Link>
            </div>
          </div>
        )}
      </div>
    </li>
  );
}

export default DropdownMenu;
