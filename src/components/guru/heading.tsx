'use client';
import Image from 'next/image';
import Link from 'next/link';

function Heading() {
  return (
    <>
      <div className='mb-1 mt-5 w-[65%] rounded-lg border border-gray-200 bg-white object-fill p-6 shadow'>
        <h5 className='mb-2 text-xl font-bold tracking-tight text-gray-900 dark:text-white'>KUESIONER KINERJA GURU PENGGERAK</h5>
        <p className='mb-2 text-sm font-semibold tracking-tight text-gray-900 dark:text-white'>PETUNJUK PENGISIAN : </p>
        <div className='mx-4 my-4 hidden text-xs font-semibold md:block md:text-sm md:last:font-medium'>
          <table className='table-auto border-collapse border border-black '>
            <thead>
              <tr>
                <td className='border border-black p-2 text-center'>Belum Dilakukan</td>
                <td className='border border-black p-2 text-center'>Mulai Dilakukan</td>
                <td className='border border-black p-2 text-center'>Sering Dilakukan</td>
                <td className='border border-black p-2 text-center'>Konsisten Dilakukan</td>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className='border border-black p-2 text-center'>Praktik yang diharapkan belum dilakukan dalam enam bulan terakhir</td>
                <td className='border border-black p-2 text-center'>Praktik yang diharapkan sudah mulai dilakukan setidaknya 1-2 kali dalam enam bulan terakhir</td>
                <td className='border border-black p-2 text-center'>Praktik yang diharapkan sudah sering dilakukan dan sudah memiliki jadwal yang rutin, hanya belum konsisten dilaksanakan</td>
                <td className='border border-black p-2 text-center'>Praktik yang diharapkan sudah konsisten dilakukan sesuai jadwal yang dimiliki</td>
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <td className='border border-black p-2 text-center'>1</td>
                <td className='border border-black p-2 text-center'>2</td>
                <td className='border border-black p-2 text-center'>3</td>
                <td className='border border-black p-2 text-center'>4</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </>
  );
}

export default Heading;
