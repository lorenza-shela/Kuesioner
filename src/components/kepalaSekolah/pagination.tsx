import React, { useState, FormEvent, useEffect } from 'react';
import { auth, db } from '../../API/firebase';
import { getFirestore, doc, setDoc, getDoc, updateDoc, collection } from 'firebase/firestore';
import 'tailwindcss/tailwind.css';
import { Router, useRouter } from 'next/router';
import Container from '../container';
import Heading from './heading';
import Card from './card';
import Biodata from './biodata';
import FloatingButton from '../floatingButton';

interface Data {
  kategori: string;
  penjelasan: string;
  [key: string]: string | undefined;
}

export default function Pagination({ data }: { data: Data[] }) {
  const router = useRouter();
  const { nipnuptk, documentNames } = router.query;
  let documentNamesString = '';
  // biodata
  const [npsnPeninjau, setNpsnPeninjau] = useState('');
  const [npsnResponden, setNpsnResponden] = useState('');
  const [nama, setNama] = useState('');
  const [asalSekolah, setAsalSekolah] = useState('');
  // variabel baru
  const [tempatTanggalLahir, setTempatTanggalLahir] = useState('');
  const [jenisKelamin, setJenisKelamin] = useState('');
  const [pangkat, setPangkat] = useState('');
  const [TMT, setTMT] = useState('');
  const [masaKerja, setMasaKerja] = useState('');
  const [pendidikanTerakhir, setPendidikanTerakhir] = useState('');

  const [jawaban, setJawaban] = useState<Record<string, string>>({});
  const [prevNpsnResponden, setPrevNpsnResponden] = useState(npsnResponden);

  if (typeof documentNames === 'string') {
    documentNamesString = documentNames;
  } else if (Array.isArray(documentNames)) {
    documentNamesString = documentNames[0];
  }

  useEffect(() => {
    if (!nipnuptk) {
      alert('Anda harus login terlebih dahulu');
      router.push('/');
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (documentNames) {
        const docRef = doc(db, 'kuesionerKepSek', documentNamesString);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setNpsnPeninjau(data.npsnPeninjau);
          setNpsnResponden(data.npsnResponden);
          setNama(data.nama);
          setAsalSekolah(data.asalSekolah);
          setTempatTanggalLahir(data.tempatTanggalLahir);
          setJenisKelamin(data.jenisKelamin);
          setPangkat(data.pangkat);
          setTMT(data.TMT);
          setMasaKerja(data.masaKerja);
          setPendidikanTerakhir(data.pendidikanTerakhir);
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
    const formFields = [nipnuptk, npsnResponden, nama, asalSekolah, tempatTanggalLahir, jenisKelamin, pangkat, TMT, masaKerja, pendidikanTerakhir, jawaban];
    const isFormFilled = formFields.every((field) => field !== '');
    const isRadioSelected = Object.values(jawaban).some((value) => value !== '');

    if (!isFormFilled || !isRadioSelected) {
      alert('Semua data harus diisi terlebih dahulu');
      return;
    }
    if (documentNames && prevNpsnResponden !== npsnResponden) {
      alert('Perhatian, NPSN tidak dapat diubah. Jika Anda ingin mengubah NPSN, silakan hapus entri saat ini dan buat entri baru. Terima kasih atas pengertian Anda.');
      setNpsnResponden(prevNpsnResponden);
      return;
    }

    try {
      const docRef = doc(db, 'kuesionerKepSek', npsnResponden);
      const docSnap = await getDoc(docRef);
      const data = {
        npsnPeninjau: nipnuptk,
        npsnResponden: npsnResponden,
        nama: nama,
        asalSekolah: asalSekolah,
        tempatTanggalLahir: tempatTanggalLahir,
        jenisKelamin: jenisKelamin,
        pangkat: pangkat,
        TMT: TMT,
        masaKerja: masaKerja,
        pendidikanTerakhir: pendidikanTerakhir,
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
        query: { nipnuptk: nipnuptk },
      });
    } catch (error: any) {
      console.error('Terjadi kesalahan saat Mengisi Kuesioner:', error.message);
      alert(`Kuesioner gagal di isi karena: ${error.message}`);
    }
  };

  const [currentPage, setCurrentPage] = useState(0);

  const handleNext = (e: React.MouseEvent) => {
    e.preventDefault();
    setCurrentPage((prevPageNumber) => prevPageNumber + 1);
  };

  const handlePrevious = (e: React.MouseEvent) => {
    e.preventDefault();
    setCurrentPage((prevPageNumber) => prevPageNumber - 1);
  };

  return (
    <div>
      <Container>
        <FloatingButton />
        <Heading />
        <form className='md:w-[65%]' onSubmit={handleSubmit}>
          {currentPage === 0 && (
            <Biodata
              npsnResponden={npsnResponden}
              setNipNuptk={setNpsnResponden}
              nama={nama}
              setNama={setNama}
              asalSekolah={asalSekolah}
              setAsalSekolah={setAsalSekolah}
              tempatTanggalLahir={tempatTanggalLahir}
              setTempatTanggalLahir={setTempatTanggalLahir}
              jenisKelamin={jenisKelamin}
              setJenisKelamin={setJenisKelamin}
              pangkat={pangkat}
              setPangkat={setPangkat}
              TMT={TMT}
              setTMT={setTMT}
              masaKerja={masaKerja}
              setMasaKerja={setMasaKerja}
              pendidikanTerakhir={pendidikanTerakhir}
              setPendidikanTerakhir={setPendidikanTerakhir}
            />
          )}

          {currentPage > 0 && currentPage <= data.length && (
            <div>
              <div className='mb-4 rounded-lg border border-gray-200 bg-white object-fill p-6 shadow'>
                <h5 className='mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white'>{data[currentPage - 1].kategori}</h5>
                <p className='font-normal text-gray-700 dark:text-gray-400'>{data[currentPage - 1].penjelasan}</p>
              </div>

              {Object.entries(data[currentPage - 1])
                .filter(([key]) => key.startsWith('pertanyaan'))
                .map(([key, value]) => (
                  <Card key={key}>
                    <div className=''>
                      <label className='font-semibold text-gray-900 dark:text-white'>{value}</label>
                      <ul className='my-4 w-full items-center rounded-lg border border-gray-200 bg-white text-sm font-normal text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white sm:flex'>
                        <li className='w-full border-b border-gray-200 dark:border-gray-600 sm:border-b-0 sm:border-r'>
                          <div className='flex items-center pl-3'>
                            <input
                              id={`belum-dilakukan-${key}`}
                              type='radio'
                              required={true}
                              value='1'
                              checked={jawaban[`${key}-${currentPage}`] === '1'}
                              name={`${key}-${currentPage}`}
                              onChange={handleRadioChange}
                              className='h-4 w-4 border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-500 dark:bg-gray-600 dark:ring-offset-gray-700 dark:focus:ring-blue-600 dark:focus:ring-offset-gray-700'
                            />
                            <label htmlFor={`belum-dilakukan-${key}`} className='ml-2 w-full py-3 text-sm font-medium text-gray-900 dark:text-gray-300'>
                              Belum Dilakukan{' '}
                            </label>
                          </div>
                        </li>
                        <li className='w-full border-b border-gray-200 dark:border-gray-600 sm:border-b-0 sm:border-r'>
                          <div className='flex items-center pl-3'>
                            <input
                              id={`mulai-dilakukan-${key}`}
                              type='radio'
                              value='2'
                              checked={jawaban[`${key}-${currentPage}`] === '2'}
                              name={`${key}-${currentPage}`}
                              onChange={handleRadioChange}
                              className='h-4 w-4 border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-500 dark:bg-gray-600 dark:ring-offset-gray-700 dark:focus:ring-blue-600 dark:focus:ring-offset-gray-700'
                            />
                            <label htmlFor={`mulai-dilakukan-${key}`} className='ml-2 w-full py-3 text-sm font-medium text-gray-900 dark:text-gray-300'>
                              Mulai Dilakukan
                            </label>
                          </div>
                        </li>
                        <li className='w-full border-b border-gray-200 dark:border-gray-600 sm:border-b-0 sm:border-r'>
                          <div className='flex items-center pl-3'>
                            <input
                              id={`sering-dilakukan-${key}`}
                              type='radio'
                              value='3'
                              checked={jawaban[`${key}-${currentPage}`] === '3'}
                              name={`${key}-${currentPage}`}
                              onChange={handleRadioChange}
                              className='h-4 w-4 border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-500 dark:bg-gray-600 dark:ring-offset-gray-700 dark:focus:ring-blue-600 dark:focus:ring-offset-gray-700'
                            />
                            <label htmlFor={`sering-dilakukan-${key}`} className='ml-2 w-full py-3 text-sm font-medium text-gray-900 dark:text-gray-300'>
                              Sering Dilakukan
                            </label>
                          </div>
                        </li>
                        <li className='w-full dark:border-gray-600'>
                          <div className='flex items-center pl-3'>
                            <input
                              id={`Konsisten-dilakukan-${key}`}
                              type='radio'
                              checked={jawaban[`${key}-${currentPage}`] === '4'}
                              value='4'
                              name={`${key}-${currentPage}`}
                              onChange={handleRadioChange}
                              className='h-4 w-4 border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-500 dark:bg-gray-600 dark:ring-offset-gray-700 dark:focus:ring-blue-600 dark:focus:ring-offset-gray-700'
                            />
                            <label htmlFor={`Konsisten-dilakukan-${key}`} className='ml-2 w-full py-3 text-sm font-medium text-gray-900 dark:text-gray-300'>
                              Konsisten Dilakukan
                            </label>
                          </div>
                        </li>
                      </ul>
                    </div>
                  </Card>
                ))}
            </div>
          )}
          {currentPage > 0 && (
            <button className='my-2 mr-2 rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700' onClick={handlePrevious}>
              Sebelumnya
            </button>
          )}
          {currentPage < data.length && (
            <button className='mx-2 my-2 rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700' onClick={handleNext}>
              Berikutnya
            </button>
          )}
          {currentPage === data.length && (
            <button type='submit' className='mx-2 my-2 rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700'>
              Kirim Survei
            </button>
          )}
        </form>
      </Container>
    </div>
  );
}
