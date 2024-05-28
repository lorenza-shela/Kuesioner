/* eslint-disable @next/next/no-img-element */
'use client';
import React from 'react';
import { useState } from 'react';
import Link from 'next/link';
import { FaLaptop, FaFileAlt, FaKeyboard, FaUserCircle, FaPrint } from 'react-icons/fa';
import { motion } from 'framer-motion';

function Dropdown() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <div className='flex min-h-screen flex-col justify-center bg-blue-500 py-6 capitalize sm:py-12'>
        <h1 className='mb-6 px-4 text-center text-xl font-semibold uppercase text-white sm:text-2xl md:text-4xl'>
          TUTORIAL PENGISIAN <span className='block'>APLIKASI PENILAIAN KINERJA GURU PENGGERAK</span> <span className='block'> </span>
        </h1>
        <div className='w-full px-2 py-3 sm:mx-auto sm:max-w-xl sm:px-0'>
          <div className='relative text-sm font-semibold text-gray-700 antialiased'>
            {/* <!-- Vertical bar running through middle --> */}
            <div className='absolute left-1/2 hidden h-full w-1 -translate-x-1/2 transform bg-blue-300 sm:block'></div>

            {/* <!-- Left section, set by justify-start and sm:pr-8 --> */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                ease: 'easeInOut',
                duration: 0.5,
                y: { duration: 0.5 },
              }}
              className='mt-6 sm:mb-12 sm:mt-0'
            >
              <div className='flex flex-col items-center sm:flex-row'>
                <div className='mx-auto flex w-full items-center justify-start'>
                  <div className='w-full sm:w-1/2 sm:pr-8'>
                    <div className='rounded bg-white p-4 shadow'>lakukan pendaftaran terlebih dahulu agar memiliki akun untuk dapat login ke aplikasi</div>
                  </div>
                </div>
                <div className='absolute left-1/2 flex h-9 w-9 -translate-x-1/2 -translate-y-4 transform items-center justify-center rounded-full border-4 border-white bg-blue-500 sm:translate-y-0'>
                  <FaLaptop className='h-5 w-5 text-white' />
                </div>
              </div>
            </motion.div>

            {/* <!-- Right section, set by justify-end and sm:pl-8 --> */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                ease: 'easeInOut',
                duration: 0.5,
                y: { duration: 0.5 },
              }}
              className='mt-6 sm:mb-12 sm:mt-0'
            >
              <div className='flex flex-col items-center sm:flex-row'>
                <div className='mx-auto flex w-full items-center justify-end'>
                  <div className='w-full sm:w-1/2 sm:pl-8'>
                    <div className='rounded bg-white p-4 shadow'>setelah login kepala sekolah dapat memilih kuesioner Penilaian kinerja untuk melakukan penilaian terhadap guru penggerak</div>
                  </div>
                </div>
                <div className='absolute left-1/2 flex h-9 w-9 -translate-x-1/2 -translate-y-4 transform items-center justify-center rounded-full border-4 border-white bg-blue-500 sm:translate-y-0'>
                  <FaFileAlt className='h-5 w-5 text-white' />
                </div>
              </div>
            </motion.div>

            {/* <!-- Left section, set by justify-start and sm:pr-8 --> */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                ease: 'easeInOut',
                duration: 0.5,
                y: { duration: 0.5 },
              }}
              className='mt-6 sm:mb-12 sm:mt-0'
            >
              <div className='flex flex-col items-center sm:flex-row'>
                <div className='mx-auto flex w-full items-center justify-start'>
                  <div className='w-full sm:w-1/2 sm:pr-8'>
                    <div className='rounded bg-white p-4 shadow'>isikan data guru penggerak kemudian lakukan penilaian terhadap guru penggerak tersebut. kepala sekolah dapat mengahapus atau merubah data yang telah di isi</div>
                  </div>
                </div>
                <div className='absolute left-1/2 flex h-9 w-9 -translate-x-1/2 -translate-y-4 transform items-center justify-center rounded-full border-4 border-white bg-blue-500 sm:translate-y-0'>
                  <FaKeyboard className='h-5 w-5 text-white' />
                </div>
              </div>
            </motion.div>

            {/* <!-- Right section, set by justify-end and sm:pl-8 --> */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                ease: 'easeInOut',
                duration: 0.5,
                y: { duration: 0.5 },
              }}
              className='mt-6 sm:mt-0'
            >
              <div className='flex flex-col items-center sm:flex-row'>
                <div className='mx-auto flex w-full items-center justify-end'>
                  <div className='w-full sm:w-1/2 sm:pl-8'>
                    <div className='rounded bg-white p-4 shadow'>pada fitur profil guru silahkan upload foto guru penggerak dan bukti aksinyata yang sudah di buat</div>
                  </div>
                </div>
                <div className='absolute left-1/2 flex h-9 w-9 -translate-x-1/2 -translate-y-4 transform items-center justify-center rounded-full border-4 border-white bg-blue-500 sm:translate-y-0'>
                  <FaUserCircle className='h-5 w-5 text-white' />
                </div>
              </div>
            </motion.div>

            {/* <!-- Left section, set by justify-start and sm:pr-8 --> */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                ease: 'easeInOut',
                duration: 0.5,
                y: { duration: 0.5 },
              }}
              className='mt-6 sm:mb-12 sm:mt-0'
            >
              <div className='flex flex-col items-center sm:flex-row'>
                <div className='mx-auto flex w-full items-center justify-start'>
                  <div className='w-full sm:w-1/2 sm:pr-8'>
                    <div className='rounded bg-white p-4 shadow'>cetak hasil penilaian kinerja guru penggerak yang di lakukan oleh kepala sekolah. kepala sekolah dapat melihat indeks dari sekolah dan guru penggerak</div>
                  </div>
                </div>
                <div className='absolute left-1/2 flex h-9 w-9 -translate-x-1/2 -translate-y-4 transform items-center justify-center rounded-full border-4 border-white bg-blue-500 sm:translate-y-0'>
                  <FaPrint className='h-5 w-5 text-white' />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dropdown;
