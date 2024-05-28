/* eslint-disable @next/next/no-img-element */
'use client';
import Link from 'next/link';
import { useRouter } from 'next/router';
function ListDashboard() {
  const router = useRouter();
  const { nipnuptk } = router.query;
  return (
    <>
      <li>
        <Link href={`/`} className='group flex items-center rounded-lg p-2 text-white hover:bg-gray-700'>
          <svg className='h-5 w-5  text-gray-400 transition duration-75 group-hover:text-white' aria-hidden='true' xmlns='http://www.w3.org/2000/svg' fill='currentColor' viewBox='0 0 22 21'>
            <path stroke='currentColor' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='m4 12 8-8 8 8M6 10.5V19c0 .6.4 1 1 1h3v-3c0-.6.4-1 1-1h2c.6 0 1 .4 1 1v3h3c.6 0 1-.4 1-1v-8.5' />
          </svg>
          <span className='ml-3'>Home</span>
        </Link>
      </li>
    </>
  );
}

export default ListDashboard;
