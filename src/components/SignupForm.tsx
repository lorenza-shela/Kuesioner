/* eslint-disable @next/next/no-img-element */
import React, { useState, FormEvent } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../API/firebase';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';
import 'tailwindcss/tailwind.css';
import Link from 'next/link';
import { useRouter } from 'next/router';

const SignupForm: React.FC = () => {
  const [npsn, setNpsn] = useState('');
  const [nipnuptk, setNipNuptk] = useState('');
  const [password, setPassword] = useState('');
  const [pangkat, setPangkat] = useState('');
  const [jabatan, setJabatan] = useState('');
  const [unitKerja, setUnitkerja] = useState('');
  const [alamat, setAlamat] = useState('');
  const [nama, setNama] = useState('');
  const router = useRouter();

  const handleSignup = async (e: FormEvent) => {
    e.preventDefault();

    try {
      // Cek apakah NPSN sudah terdaftar
      const docRef = doc(db, 'users', nipnuptk);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        // Jika NPSN sudah terdaftar, tampilkan pesan kesalahan
        alert('NIP / NUPTK sudah terdaftar. Silahkan login.');
        return;
      }

      // Jika NPSN belum terdaftar, simpan data pengguna ke Firestore
      await setDoc(docRef, {
        npsn: npsn,
        nipnuptk: nipnuptk,
        nama: nama,
        pangkat: pangkat,
        jabatan: jabatan,
        unitKerja: unitKerja,
        alamat: alamat,
        password: password,
      });
      console.log('Pengguna berhasil mendaftar:', npsn);
      alert('Pengguna berhasil mendaftar');

      // Redirect ke halaman login
      router.push('/login');
    } catch (error: any) {
      console.error('Terjadi kesalahan saat pendaftaran:', error.message);

      // Menampilkan pesan kesalahan
      alert(`Daftar gagal karena: ${error.message}`);
    }
  };

  return (
    <>
      <section className='bg-gradient-calm-elegant min-h-screen dark:bg-gray-900'>
        <div className='mx-auto flex min-h-screen flex-col items-center justify-center px-6 py-8 lg:py-0'>
          <div className='my-5 w-full rounded-lg bg-white shadow dark:border dark:border-gray-700 dark:bg-gray-800 sm:max-w-md xl:p-0'>
            <div className='space-y-4 p-6 sm:p-8 md:space-y-6'>
              <h1 className='text-xl font-bold leading-tight tracking-tight text-gray-900 dark:text-white md:text-2xl'>Create an account</h1>
              <form className='space-y-4 md:space-y-6' onSubmit={handleSignup}>
                <div>
                  <label htmlFor='npsn' className='mb-2 block text-sm font-medium text-gray-900 dark:text-white'>
                    NPSN
                  </label>
                  <input
                    type='text'
                    name='npsn'
                    id='npsn'
                    className='focus:ring-primary-600 focus:border-primary-600 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500 sm:text-sm'
                    placeholder='NPSN'
                    required={true}
                    value={npsn}
                    onChange={(e) => setNpsn(e.target.value)}
                  />
                </div>
                <div>
                  <label htmlFor='npsn' className='mb-2 block text-sm font-medium text-gray-900 dark:text-white'>
                    NIP / NUPTK
                  </label>
                  <input
                    type='text'
                    name='nipnuptk'
                    id='nipnuptk'
                    className='focus:ring-primary-600 focus:border-primary-600 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500 sm:text-sm'
                    placeholder='NIP / NUPTK'
                    required={true}
                    value={nipnuptk}
                    onChange={(e) => setNipNuptk(e.target.value)}
                  />
                </div>
                <div>
                  <label htmlFor='nama' className='mb-2 block text-sm font-medium text-gray-900 dark:text-white'>
                    Nama
                  </label>
                  <input
                    type='text'
                    name='nama'
                    id='nama'
                    className='focus:ring-primary-600 focus:border-primary-600 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500 sm:text-sm'
                    placeholder='Nama'
                    required={true}
                    value={nama}
                    onChange={(e) => setNama(e.target.value)}
                  />
                </div>
                <div>
                  <label htmlFor='pangkat' className='mb-2 block text-sm font-medium text-gray-900 dark:text-white'>
                    Pangkat / Golongan Ruang
                  </label>
                  <input
                    type='text'
                    name='pangkat'
                    id='pangkat'
                    className='focus:ring-primary-600 focus:border-primary-600 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500 sm:text-sm'
                    placeholder='Pangkat / Golongan Ruang'
                    required={true}
                    value={pangkat}
                    onChange={(e) => setPangkat(e.target.value)}
                  />
                </div>
                <div>
                  <label htmlFor='jabatan' className='mb-2 block text-sm font-medium text-gray-900 dark:text-white'>
                    Jabatan
                  </label>
                  <input
                    type='text'
                    name='jabatan'
                    id='jabatan'
                    className='focus:ring-primary-600 focus:border-primary-600 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500 sm:text-sm'
                    placeholder='Jabatan'
                    required={true}
                    value={jabatan}
                    onChange={(e) => setJabatan(e.target.value)}
                  />
                </div>
                <div>
                  <label htmlFor='unitKerja' className='mb-2 block text-sm font-medium text-gray-900 dark:text-white'>
                    Unit Kerja
                  </label>
                  <input
                    type='text'
                    name='unitKerja'
                    id='unitKerja'
                    className='focus:ring-primary-600 focus:border-primary-600 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500 sm:text-sm'
                    placeholder='Unit Kerja'
                    required={true}
                    value={unitKerja}
                    onChange={(e) => setUnitkerja(e.target.value)}
                  />
                </div>
                <div>
                  <label htmlFor='alamat' className='mb-2 block text-sm font-medium text-gray-900 dark:text-white'>
                    Alamat
                  </label>
                  <input
                    type='text'
                    name='alamat'
                    id='alamat'
                    className='focus:ring-primary-600 focus:border-primary-600 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500 sm:text-sm'
                    placeholder='Alamat'
                    required={true}
                    value={alamat}
                    onChange={(e) => setAlamat(e.target.value)}
                  />
                </div>
                <div>
                  <label htmlFor='password' className='mb-2 block text-sm font-medium text-gray-900 dark:text-white'>
                    Password
                  </label>
                  <input
                    type='password'
                    name='password'
                    id='password'
                    placeholder='••••••••'
                    className='focus:ring-primary-600 focus:border-primary-600 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500 sm:text-sm'
                    required={true}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <div className='flex items-start'>
                  <div className='flex h-5 items-center'>
                    <input
                      id='terms'
                      aria-describedby='terms'
                      type='checkbox'
                      className='focus:ring-3 focus:ring-primary-300 dark:focus:ring-primary-600 h-4 w-4 rounded border border-gray-300 bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800'
                      required={true}
                    />
                  </div>
                  <div className='ml-3 text-sm'>
                    <label htmlFor='terms' className='font-light text-gray-500 dark:text-gray-300'>
                      I accept the{' '}
                      <a className='text-primary-600 dark:text-primary-500 font-medium hover:underline' href='#'>
                        Terms and Conditions
                      </a>
                    </label>
                  </div>
                </div>
                <button
                  type='submit'
                  className='w-full rounded-lg bg-blue-600 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800'
                >
                  Create an account
                </button>
                <p className='text-sm font-light text-gray-500 dark:text-gray-400'>
                  Already have an account?{' '}
                  <Link href='/login' className='text-primary-600 dark:text-primary-500 font-medium hover:underline'>
                    Login here
                  </Link>
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
export default SignupForm;
