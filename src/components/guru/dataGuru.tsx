// pages/index.js atau halaman yang sesuai
import React, { useState, FormEvent, useEffect } from 'react';
import { auth, db } from '../../API/firebase';
import { getFirestore, doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import 'tailwindcss/tailwind.css';
import { Router, useRouter } from 'next/router';
import Container from '../container';
import FloatingButton from '../floatingButton';
import { fileURLToPath } from 'url';

type PertanyaanData = {
  kategori: string;
  penjelasan: string;
  [key: string]: string;
}[];

const pertanyaanData: PertanyaanData = [
  // Your data here
];
type JawabanData = {
  [key: string]: string;
};

type UserData = {
  alamat: string;
  jabatan: string;
  nama: string;
  npsn: string;
  nipnuptk: string;
  pangkat: string;
  unitKerja: string;
};

type KuesionerData = {
  asalSekolah: string;
  nama: string;
  npsnPeninjau: string;
  npsnResponden: string;
  tempatTanggalLahir: string;
  jenisKelamin: string;
  pangkat: string;
  TMT: string;
  masaKerja: string;
  pendidikanTerakhir: string;
  jawaban: JawabanData;
};

const DataGuru: React.FC = () => {
  const router = useRouter();
  const { documentNames } = router.query;
  let documentNamesString = '';
  const [userData, setUserData] = useState<UserData | null>(null);
  const [kuesionerData, setKuesionerData] = useState<KuesionerData | null>(null);
  const pertanyaanData = require('../../API/guru.json') as PertanyaanData;

  if (typeof documentNames === 'string') {
    documentNamesString = documentNames;
  } else if (Array.isArray(documentNames)) {
    documentNamesString = documentNames[0];
  }
  useEffect(() => {
    const fetchData = async () => {
      // Menggunakan db yang diimpor dari file konfigurasi Firebase Anda
      const kuesionerQuery = query(collection(db, 'kuesionerGuru'), where('npsnResponden', '==', documentNamesString));
      const kuesionerQuerySnapshot = await getDocs(kuesionerQuery);
      kuesionerQuerySnapshot.forEach(async (doc) => {
        const data = doc.data() as KuesionerData;
        setKuesionerData(data);

        // Menggunakan db yang diimpor dari file konfigurasi Firebase Anda
        const userQuery = query(collection(db, 'users'), where('nipnuptk', '==', data.npsnPeninjau));
        const userQuerySnapshot = await getDocs(userQuery);
        userQuerySnapshot.forEach((doc) => {
          const userData = doc.data() as UserData;
          setUserData(userData);
        });
      });
    };

    const handleDownload = (fileUrl: string) => {
      window.open(fileUrl, '_blank');
    };

    fetchData();
  }, [documentNamesString]);

  function Bukti(file : String){
    if (!file){
      <p>Tidak ada</p>
    } else {
      <button onClick={() => file} className='font-medium text-blue-700 hover:underline dark:text-red-500 md:text-sm'>
        Lihat
      </button>
    }
  }

  return (
    <>
      <Container>
        <FloatingButton />
        <div className='my-5 overflow-auto rounded-sm bg-white md:w-[65%]'>
          <h1 className='py-4 text-center text-lg font-semibold md:text-2xl'>
            HASIL PENILAIAN KUESIONER <span className='block'>KINERJA GURU PENGGERAK</span>
          </h1>
          <div className='mx-2 p-2 text-xs font-semibold md:text-base md:last:font-medium'>
            {userData && (
              <table className='table-auto'>
                <tr>
                  <td className=''>Nama</td>
                  <td className=' pl-8 pr-2 md:pl-[11.5rem] md:pr-2'>:</td>
                  <td className='text-blue-700'>{userData.nama}</td>
                </tr>
                <tr>
                  <td className=''>NPSN</td>
                  <td className=' pl-8 pr-2 md:pl-[11.5rem] md:pr-2'>:</td>
                  <td className='text-blue-700'>{userData.npsn}</td>
                </tr>
                <tr>
                  <td className=''>NIP/NUPTK</td>
                  <td className=' pl-8 pr-2 md:pl-[11.5rem] md:pr-2'>:</td>
                  <td className='text-blue-700'>{userData.nipnuptk}</td>
                </tr>
                <tr>
                  <td className=''>Alamat</td>
                  <td className=' pl-8 pr-2 md:pl-[11.5rem] md:pr-2'>:</td>
                  <td className='text-blue-700'>{userData.alamat}</td>
                </tr>
                <tr>
                  <td className=''>Jabatan</td>
                  <td className=' pl-8 pr-2 md:pl-[11.5rem] md:pr-2'>:</td>
                  <td className='text-blue-700'>{userData.jabatan}</td>
                </tr>

                <tr>
                  <td className=''>Pangkat</td>
                  <td className=' pl-8 pr-2 md:pl-[11.5rem] md:pr-2'>:</td>
                  <td className='text-blue-700'>{userData.pangkat}</td>
                </tr>
                <tr>
                  <td className=''>Unit Kerja</td>
                  <td className=' pl-8 pr-2 md:pl-[11.5rem] md:pr-2'>:</td>
                  <td className='text-blue-700'>{userData.unitKerja}</td>
                </tr>
              </table>
            )}
          </div>

          <div className=' mx-4 text-xs font-semibold md:text-base md:last:font-medium'>Menyatakan bahwa</div>
          <div className='mx-2 mb-3 p-2 text-xs font-semibold md:text-base md:last:font-medium'>
            {kuesionerData && (
              <table className='table-auto'>
                <tr>
                  <td className=''>Nama</td>
                  <td className=' pl-8 pr-2 md:pl-28 md:pr-2'>:</td>
                  <td className='text-blue-700'>{kuesionerData.nama}</td>
                </tr>
                <tr>
                  <td className=''>NPSN</td>
                  <td className=' pl-8 pr-2 md:pl-28 md:pr-2'>:</td>
                  <td className='text-blue-700'>{kuesionerData.npsnResponden}</td>
                </tr>
                <tr>
                  <td className=''>Asal Sekolah</td>
                  <td className=' pl-8 pr-2 md:pl-28 md:pr-2'>:</td>
                  <td className='text-blue-700'>{kuesionerData.asalSekolah}</td>
                </tr>
                <tr>
                  <td className=''>Tempat Tanggal Lahir</td>
                  <td className=' pl-8 pr-2 md:pl-28 md:pr-2'>:</td>
                  <td className='text-blue-700'>{kuesionerData.tempatTanggalLahir}</td>
                </tr>
                <tr>
                  <td className=''>Jenis Kelamin</td>
                  <td className=' pl-8 pr-2 md:pl-28 md:pr-2'>:</td>
                  <td className='text-blue-700'>{kuesionerData.jenisKelamin}</td>
                </tr>
                <tr>
                  <td className=''>Pangkat</td>
                  <td className=' pl-8 pr-2 md:pl-28 md:pr-2'>:</td>
                  <td className='text-blue-700'>{kuesionerData.pangkat}</td>
                </tr>
                <tr>
                  <td className=''>TMT</td>
                  <td className=' pl-8 pr-2 md:pl-28 md:pr-2'>:</td>
                  <td className='text-blue-700'>{kuesionerData.TMT}</td>
                </tr>
                <tr>
                  <td className=''>Masa Kerja</td>
                  <td className=' pl-8 pr-2 md:pl-28 md:pr-2'>:</td>
                  <td className='text-blue-700'>{kuesionerData.masaKerja}</td>
                </tr>
                <tr>
                  <td className=''>Pendidikan Terakhir</td>
                  <td className=' pl-8 pr-2 md:pl-28 md:pr-2'>:</td>
                  <td className='text-blue-700'>{kuesionerData.pendidikanTerakhir}</td>
                </tr>
              </table>
            )}
          </div>
          <div className=' mx-4 text-xs font-semibold md:text-base md:last:font-medium'>Telah melaksanakan kegiatan program guru penggerak</div>
          <div className='mx-4 my-4 text-xs font-semibold md:text-base md:last:font-medium'>
            {kuesionerData && (
              <table className='table-auto border-collapse border border-black'>
                <thead>
                  <tr>
                    <td className='border border-black p-2 text-center'>Kompetensi</td>
                    <td className='border border-black p-5 text-center'>Dokumen Pedukung</td>
                    <td className='border border-black p-2 px-4 text-center text-blue-700'>Nilai</td>
                  </tr>
                </thead>
                <tbody>
                  {pertanyaanData.map((pertanyaan, index) => {
                    const pertanyaanKeys = Object.keys(pertanyaan).filter((key) => key.startsWith('pertanyaan'));
                    return pertanyaanKeys.map((key) => (
                      <tr key={`${index}_${key}`}>
                        <td className='border border-black p-2 text'>{pertanyaan[key]}</td>
                        {kuesionerData && kuesionerData.jawaban && (
                          <td key={`${index}_${key}`} className='border border-black text-center p-2'>
                            {/* <button onClick={() => fileURLToPath} className='font-medium text-blue-700 hover:underline dark:text-red-500'>
                            Lihat
                          </button> */}
                          <i className='text-center text-gray-400'>Tidak ada Berkas</i>
                          </td>
                        )}
                        {kuesionerData && kuesionerData.jawaban && (
                          <td key={`${index}_${key}`} className='border border-black p-2 px-4 text-center text-blue-700'>
                            {kuesionerData.jawaban[`${key}-${index + 1}`]}
                          </td>
                        )}
                      </tr>
                    ));
                  })}
                </tbody>

                <tfoot>
                  <tr>
                    <td colSpan={2} className='border border-black p-2 text-center'>Jumlah (Hasil Penilaian Kinerja Guru Penggerak)</td>
                    <td className='border border-black p-2 px-4 text-center text-blue-700'><b>{Object.values(kuesionerData.jawaban).reduce((a, b) => a + Number(b), 0)}</b></td>
                  </tr>
                  <tr>
                    {(() => {
                      const total = Object.values(kuesionerData.jawaban).reduce((a, b) => a + Number(b), 0);
                      let color = '';
                      let label = '';

                      if (total >= 0 && total <= 60) {
                        color = 'text-red-600';
                        label = 'Kurang';
                      } else if (total >= 61 && total <= 120) {
                        color = 'text-yellow-600';
                        label = 'Cukup';
                      } else if (total >= 121 && total <= 180) {
                        color = 'text-blue-600';
                        label = 'Baik';
                      } else if (total >= 181 && total <= 240) {
                        color = 'text-green-600';
                        label = 'Amat Baik';
                      }

                      return <td colSpan={3} className={`border border-black p-2 px-4 text-center ${color}`}>{label}</td>;
                    })()}
                  </tr>
                </tfoot>
              </table>
            )}
          </div>
        </div>
      </Container>
    </>
  );
};

export default DataGuru;
