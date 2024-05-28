// pages/index.js atau halaman yang sesuai
import React, { useState, FormEvent, useEffect } from 'react';
import { auth, db } from '../../API/firebase';
import { getFirestore, doc, setDoc, getDoc, updateDoc, collection } from 'firebase/firestore';
import { getStorage, ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';
import 'tailwindcss/tailwind.css';
import { Router, useRouter } from 'next/router';
import Container from '../container';
import Heading from './heading';
import Card from './card';
import FloatingButton from '../floatingButton';
import Cookies from 'js-cookie';

// Definisikan tipe untuk data Anda
type PertanyaanData = {
  [key: string]: string;
};

const SurveiPage: React.FC = () => {
  const router = useRouter();
  const nipnuptk = Cookies.get('nipnuptk');
  const { documentNames } = router.query;
  let documentNamesString = '';
  const [npsnPeninjau, setNpsnPeninjau] = useState('');
  const [npsnResponden, setNpsnResponden] = useState('');
  const [nama, setNama] = useState('');
  const [asalSekolah, setAsalSekolah] = useState('');
  const [jawaban, setJawaban] = useState<Record<string, string>>({});
  // Cast data Anda ke tipe yang baru dibuat
  const pertanyaanData = require('../../API/guru.json') as PertanyaanData;
  const [prevNpsnResponden, setPrevNpsnResponden] = useState(npsnResponden);

  useEffect(() => {
    if (!nipnuptk) {
      alert('Anda harus login terlebih dahulu');
      router.push('/');
    }
  }, []);

  if (typeof documentNames === 'string') {
    documentNamesString = documentNames;
  } else if (Array.isArray(documentNames)) {
    documentNamesString = documentNames[0];
  }

  useEffect(() => {
    const fetchData = async () => {
      if (documentNames) {
        const docRef = doc(db, 'kuesionerGuru', documentNamesString);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setNpsnPeninjau(data.npsnPeninjau);
          setNpsnResponden(data.npsnResponden);
          setNama(data.nama);
          setAsalSekolah(data.asalSekolah);
          setJawaban(data.jawaban);
          setPrevNpsnResponden(data.npsnResponden);
        }
      }
    };

    fetchData();
  }, [documentNames, documentNamesString]);

  const handleRadioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setJawaban({
      ...jawaban,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (documentNames && prevNpsnResponden !== npsnResponden) {
      alert('Perhatian, NPSN tidak dapat diubah. Jika Anda ingin mengubah NPSN, silakan hapus entri saat ini dan buat entri baru. Terima kasih atas pengertian Anda.');
      setNpsnResponden(prevNpsnResponden);
      return;
    }

    try {
      // Cek apakah NPSN sudah terdaftar
      const docRef = doc(db, 'kuesionerGuru', npsnResponden);
      const docSnap = await getDoc(docRef);
      const data = {
        npsnPeninjau: nipnuptk,
        npsnResponden: npsnResponden,
        nama: nama,
        asalSekolah: asalSekolah,
        jawaban: jawaban,
      };

      if (documentNames) {
        await updateDoc(docRef, data);
        console.log('Document updated:', nipnuptk);
        alert('Kuesioner Berhasil DiUpdate');
      } else {
        if (docSnap.exists()) {
          alert('npsn sudah terdaftar silahkan update');
          return;
        }
        await setDoc(docRef, data);
        alert('Kuesioner Berhasil Dibuat');
      }

      router.push({
        pathname: '/dashboard',
      });

      // Redirect ke halaman dashboard
    } catch (error: any) {
      console.error('Terjadi kesalahan saat Mengisi Kuesioner:', error.message);

      // Menampilkan pesan kesalahan
      alert(`Kuesioner gagal di isi karena: ${error.message}`);
    }
  };

  return (
    <>
      <Container>
        <FloatingButton />
        <form className='md:w-[58%]' onSubmit={handleSubmit}>
          <div>
            <Card>
              <label htmlFor='npsn' className='mb-2 block text-sm font-medium text-gray-900 dark:text-white'>
                NPSN Guru Yang Akan Di Nilai
              </label>
              <input
                type='text'
                name='npsn'
                id='npsn'
                className='focus:ring-primary-600 focus:border-primary-600 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500 sm:text-sm'
                placeholder='NPSN'
                required={true}
                value={npsnResponden}
                onChange={(e) => setNpsnResponden(e.target.value)}
              />
            </Card>
            <Card>
              <label htmlFor='nama' className='mb-2 block text-sm font-medium text-gray-900 dark:text-white'>
                Nama Guru Yang Akan Di Nilai
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
            </Card>
            <Card>
              <label htmlFor='asalSekolah' className='mb-2 block text-sm font-medium text-gray-900 dark:text-white'>
                Asal Sekolah
              </label>
              <input
                type='text'
                name='asalSekolah'
                id='asalSekolah'
                className='focus:ring-primary-600 focus:border-primary-600 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500 sm:text-sm'
                placeholder='Asal Sekolah'
                required={true}
                value={asalSekolah}
                onChange={(e) => setAsalSekolah(e.target.value)}
              />
            </Card>
          </div>
          {/*  */}
          {Object.keys(pertanyaanData).map((pertanyaanKey) => (
            <Card key={pertanyaanKey}>
              <div className=''>
                <label className='font-semibold text-gray-900 dark:text-white'>{pertanyaanData[pertanyaanKey]}</label>
                <ul className='mt-4 w-full items-center rounded-lg border border-gray-200 bg-white text-sm font-normal text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white sm:flex'>
                  <li className='w-full border-b border-gray-200 dark:border-gray-600 sm:border-b-0 sm:border-r'>
                    <div className='flex items-center pl-3'>
                      <input
                        id={`belum-dilakukan-${pertanyaanKey}`}
                        type='radio'
                        required={true}
                        value='1'
                        checked={jawaban[pertanyaanKey] === '1'}
                        name={pertanyaanKey}
                        onChange={handleRadioChange}
                        className='h-4 w-4 border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-500 dark:bg-gray-600 dark:ring-offset-gray-700 dark:focus:ring-blue-600 dark:focus:ring-offset-gray-700'
                      />
                      <label htmlFor={`belum-dilakukan-${pertanyaanKey}`} className='ml-2 w-full py-3 text-sm font-medium text-gray-900 dark:text-gray-300'>
                        Belum Dilakukan{' '}
                      </label>
                    </div>
                  </li>
                  <li className='w-full border-b border-gray-200 dark:border-gray-600 sm:border-b-0 sm:border-r'>
                    <div className='flex items-center pl-3'>
                      <input
                        id={`mulai-dilakukan-${pertanyaanKey}`}
                        type='radio'
                        value='2'
                        checked={jawaban[pertanyaanKey] === '2'}
                        name={pertanyaanKey}
                        onChange={handleRadioChange}
                        className='h-4 w-4 border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-500 dark:bg-gray-600 dark:ring-offset-gray-700 dark:focus:ring-blue-600 dark:focus:ring-offset-gray-700'
                      />
                      <label htmlFor={`mulai-dilakukan-${pertanyaanKey}`} className='ml-2 w-full py-3 text-sm font-medium text-gray-900 dark:text-gray-300'>
                        Mulai Dilakukan
                      </label>
                    </div>
                  </li>
                  <li className='w-full border-b border-gray-200 dark:border-gray-600 sm:border-b-0 sm:border-r'>
                    <div className='flex items-center pl-3'>
                      <input
                        id={`sering-dilakukan-${pertanyaanKey}`}
                        type='radio'
                        value='3'
                        checked={jawaban[pertanyaanKey] === '3'}
                        name={pertanyaanKey}
                        onChange={handleRadioChange}
                        className='h-4 w-4 border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-500 dark:bg-gray-600 dark:ring-offset-gray-700 dark:focus:ring-blue-600 dark:focus:ring-offset-gray-700'
                      />
                      <label htmlFor={`sering-dilakukan-${pertanyaanKey}`} className='ml-2 w-full py-3 text-sm font-medium text-gray-900 dark:text-gray-300'>
                        Sering Dilakukan
                      </label>
                    </div>
                  </li>
                  <li className='w-full dark:border-gray-600'>
                    <div className='flex items-center pl-3'>
                      <input
                        id={`Konsisten-dilakukan-${pertanyaanKey}`}
                        type='radio'
                        checked={jawaban[pertanyaanKey] === '4'}
                        value='4'
                        name={pertanyaanKey}
                        onChange={handleRadioChange}
                        className='h-4 w-4 border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-500 dark:bg-gray-600 dark:ring-offset-gray-700 dark:focus:ring-blue-600 dark:focus:ring-offset-gray-700'
                      />
                      <label htmlFor={`Konsisten-dilakukan-${pertanyaanKey}`} className='ml-2 w-full py-3 text-sm font-medium text-gray-900 dark:text-gray-300'>
                        Konsisten Dilakukan
                      </label>
                    </div>
                  </li>
                  
                </ul>
              </div>
            </Card>
          ))}

          <button type='submit' className='mb-5 rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700'>
            Kirim Survei
          </button>
        </form>
      </Container>
    </>
  );
};

export default SurveiPage;
