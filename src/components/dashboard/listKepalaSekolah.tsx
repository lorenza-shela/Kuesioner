/* eslint-disable @next/next/no-img-element */
'use client';
import Link from 'next/link';
import { useRouter } from 'next/router';
function ListKepalaSekolah() {
  const router = useRouter();
  const { nipnuptk } = router.query;
  return (
    <>
      <li>
        <Link href={`/dashboardKepsek`} className='group flex items-center rounded-lg p-2 text-white hover:bg-gray-700'>
          <svg className='h-5 w-5  text-gray-400 transition duration-75 group-hover:text-white' aria-hidden='true' xmlns='http://www.w3.org/2000/svg' fill='currentColor' viewBox='0 0 20 18'>
            <path d='M7 9a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9Zm2 1H5a5.006 5.006 0 0 0-5 5v2a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2a5.006 5.006 0 0 0-5-5Z' />
          </svg>
          <span className='ml-3 flex-1 whitespace-nowrap'>Kuesioner</span>
        </Link>
      </li>
    </>
  );
}

export default ListKepalaSekolah;
