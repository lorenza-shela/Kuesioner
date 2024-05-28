import { useState, FormEvent } from 'react';
import Cookies from 'js-cookie';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../API/firebase';
import { useRouter } from 'next/router';
import Link from 'next/link';
import 'tailwindcss/tailwind.css';

const ResetPasswordForm: React.FC = () => {
  const router = useRouter();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleResetPassword = async (e: FormEvent) => {
    e.preventDefault();

    // Cek apakah password baru dan konfirmasi password sama
    if (newPassword !== confirmPassword) {
      alert('Password baru dan konfirmasi password tidak sama. Silahkan coba lagi.');
      return;
    }

    try {
      // Mendapatkan NIP/NUPTK dari cookies
      const nipnuptk = Cookies.get('nipnuptk');

      // Cek apakah NIP/NUPTK ada
      if (!nipnuptk) {
        alert('NIP/NUPTK tidak ditemukan. Silahkan login terlebih dahulu.');
        return;
      }

      // Mengupdate password pengguna di Firestore
      const docRef = doc(db, 'users', nipnuptk);
      await setDoc(docRef, { password: newPassword }, { merge: true });

      // Hapus cookies
      Cookies.remove('nipnuptk');
      Cookies.remove('password');

      // Arahkan pengguna ke halaman utama
      router.push('/');

      alert('Password berhasil direset. Anda akan diarahkan ke halaman utama.');
    } catch (error: any) {
      console.error('Terjadi kesalahan saat mereset password:', error.message);

      // Menampilkan pesan kesalahan
      alert(`Reset password gagal karena: ${error.message}`);
    }
  };

  return (
    <>
      {/* <form onSubmit={handleResetPassword}>
      <input type='text' value={Cookies.get('nipnuptk')} readOnly placeholder='NIP/NUPTK' />
      <input type='password' value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder='Masukkan password baru' />
      <input type='password' value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder='Konfirmasi password baru' />
      <button type='submit'>Reset Password</button>
    </form> */}
      <section className='bg-gradient-calm-elegant h-screen'>
        <div className='mx-auto flex h-screen flex-col items-center justify-center px-6 py-8 lg:py-0'>
          <div className='w-full rounded-lg bg-white shadow dark:border dark:border-gray-700 dark:bg-gray-800 sm:max-w-md md:mt-0 xl:p-0'>
            <div className='space-y-4 p-6 sm:p-8 md:space-y-6'>
              <h1 className='text-xl font-bold leading-tight tracking-tight text-gray-900 dark:text-white md:text-2xl'>Reset Password</h1>
              <form className='space-y-4 md:space-y-6' onSubmit={handleResetPassword}>
                <div>
                  <label htmlFor='nipnuptk' className='mb-2 block text-sm font-medium text-gray-900 dark:text-white'>
                    NIP / NUPTK
                  </label>
                  <input
                    className='focus:ring-primary-600 focus:border-primary-600 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500 sm:text-sm'
                    required={true}
                    type='text'
                    value={Cookies.get('nipnuptk')}
                    readOnly
                    placeholder='NIP/NUPTK'
                  />
                </div>
                <div>
                  <label htmlFor='password' className='mb-2 block text-sm font-medium text-gray-900 dark:text-white'>
                    Password
                  </label>
                  <input
                    className='focus:ring-primary-600 focus:border-primary-600 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500 sm:text-sm'
                    required={true}
                    type='password'
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder='Masukkan password baru'
                  />
                </div>
                <div>
                  <label htmlFor='password' className='mb-2 block text-sm font-medium text-gray-900 dark:text-white'>
                    Confirm Password
                  </label>
                  <input
                    className='focus:ring-primary-600 focus:border-primary-600 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500 sm:text-sm'
                    required={true}
                    type='password'
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder='Konfirmasi password baru'
                  />
                </div>
                <button
                  type='submit'
                  className='bg-primary-600 hover:bg-primary-700 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800 w-full rounded-lg px-5 py-2.5 text-center text-sm font-medium text-white focus:outline-none focus:ring-4'
                >
                  Reset Password
                </button>
                <p className='text-sm font-light text-gray-500 dark:text-gray-400'>
                  Don’t have an account yet?{' '}
                  <Link href='/SignUp' className='text-primary-600 dark:text-primary-500 font-medium hover:underline'>
                    Sign up
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

export default ResetPasswordForm;
