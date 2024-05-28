// pages/index.js atau halaman yang sesuai
import React, { useState, FormEvent, useEffect } from 'react';
import { auth, db } from '../../API/firebase';
import { getFirestore, doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import 'tailwindcss/tailwind.css';
import Cookies from 'js-cookie';
import { Router, useRouter } from 'next/router';
import Container from '../container';
import FloatingButton from '../floatingButton';
import ReactLoading from 'react-loading';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import '../../../public/font/Poppins-Regular-normal';
import pertanyaanDataTable from '../../API/kepalaSekolah.json';

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
  [key: string]: any; // Index signature
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

const DataKepsek: React.FC = () => {
  const router = useRouter();
  const { documentNames } = router.query;
  const { view } = router.query;
  const isViewMode = view === 'true';
  let documentNamesString = '';
  const [userData, setUserData] = useState<UserData | null>(null);
  const [kuesionerData, setKuesionerData] = useState<KuesionerData | null>(null);
  const pertanyaanData = require('../../API/guru.json') as PertanyaanData;
  const nipnuptk = Cookies.get('nipnuptk');
  const [isLoading, setIsLoading] = useState(false);

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
      // Menggunakan db yang diimpor dari file konfigurasi Firebase Anda
      const kuesionerQuery = query(collection(db, 'kuesionerKepSek'), where('npsnResponden', '==', documentNamesString));
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

    fetchData();
  }, [documentNamesString]);

  // Kemudian, buat peta pertanyaan
  const questionMap: { [key: string]: string } = {};
  pertanyaanData.forEach((item: any, index: number) => {
    Object.keys(item).forEach((key) => {
      if (key.startsWith('pertanyaan')) {
        questionMap[`${key}-${index + 1}`] = item[key];
      }
    });
  });

  // Definisikan fungsi generatePDF
  const generatePDF = (kuesionerData: KuesionerData) => {
    // Membuat dokumen PDF baru
    const doc = new jsPDF();

    // Menyiapkan data untuk tabel
    const tableData = Object.keys(kuesionerData.jawaban)
      .sort((a, b) => {
        // Mengambil nomor pertanyaan dari kunci
        const matchA = a.match(/\d+/);
        const matchB = b.match(/\d+/);
        const numA = matchA ? parseInt(matchA[0], 10) : 0;
        const numB = matchB ? parseInt(matchB[0], 10) : 0;

        // Mengurutkan berdasarkan nomor pertanyaan
        return numA - numB;
      })
      .map((key, index) => {
        // Memisahkan nomor dan teks pertanyaan
        const questionText = (questionMap[key] || key).trim(); // Gunakan trim di sini
        const questionNumber = questionText.split('.')[0];
        const questionBody = questionText.split('.').slice(1).join('.').trim(); // Gunakan trim lagi di sini

        return [
          questionNumber, // Nomor pertanyaan
          questionBody, // Teks pertanyaan
          kuesionerData.jawaban[key], // Jawaban
        ];
      });

    // Hitung total
    const total = Object.values(kuesionerData.jawaban).reduce((a, b) => a + Number(b), 0);
    let label = '';

    if (total >= 0 && total <= 32) {
      label = 'Kurang';
    } else if (total >= 33 && total <= 64) {
      label = 'Cukup';
    } else if (total >= 65 && total <= 96) {
      label = 'Baik';
    } else if (total >= 97 && total <= 128) {
      label = 'Amat Baik';
    }

    // Tambahkan baris total ke data tabel
    tableData.push(['', 'Total', total.toString()]);
    tableData.push(['', 'Label', label]);

    doc.addFont('Poppins-Regular.ttf', 'Poppins', 'normal');

    // Menambahkan judul
    doc.setFontSize(25);
    doc.setFont('courier', 'bold');
    doc.text('HASIL PENILAIAN KUESIONER', 105, 20, { align: 'center' });
    doc.setFontSize(25);
    doc.setFont('courier', 'bold');
    doc.text('KINERJA GURU PENGGERAK', 105, 30, { align: 'center' });
    doc.setFont('courier', 'normal');

    // Menambahkan data pengguna
    doc.setFontSize(12);
    doc.text(`Nama   : ${userData?.nama}`, 20, 50);
    doc.text(`NPSN   : ${userData?.npsn}`, 20, 60);
    doc.text(`NIP/NUPTK: ${userData?.nipnuptk}`, 20, 70);
    doc.text(`Alamat : ${userData?.alamat}`, 20, 80);
    doc.text(`Jabatan: ${userData?.jabatan}`, 20, 90);
    doc.text(`Pangkat: ${userData?.pangkat}`, 20, 100);
    doc.text(`Unit Kerja: ${userData?.unitKerja}`, 20, 110);

    doc.setFont('courier', 'bold');
    doc.text('MENYATAKAN BAHWA : ', 20, 120);
    doc.setFont('courier', 'normal');

    doc.setFontSize(12);
    doc.text(`Nama   : ${kuesionerData?.nama}`, 20, 130);
    doc.text(`NPSN   : ${kuesionerData?.npsnResponden}`, 20, 140);
    doc.text(`Asal Sekolah: ${kuesionerData?.asalSekolah}`, 20, 150);
    doc.text(`TTL : ${kuesionerData?.tempatTanggalLahir}`, 20, 160);
    doc.text(`Jenis Kelamin: ${kuesionerData?.jenisKelamin}`, 20, 170);
    doc.text(`Pangkat: ${kuesionerData?.pangkat}`, 20, 180);
    doc.text(`TMT: ${kuesionerData?.TMT}`, 20, 190);
    doc.text(`Masa Kerja: ${kuesionerData?.masaKerja}`, 20, 200);
    doc.text(`Pendidikan Terakhir: ${kuesionerData?.pendidikanTerakhir}`, 20, 210);

    doc.setFont('courier', 'bold');
    doc.text('Telah melaksanakan kegiatan program guru penggerak : ', 20, 230);
    doc.setFont('courier', 'normal');

    // @ts-ignore
    doc.autoTable({
      startY: 240,
      head: [['No', 'Pertanyaan', 'Jawaban']],
      body: tableData,
      styles: {
        halign: 'center',
        lineWidth: 0.05,
        lineColor: [0, 0, 0],
      },
      columnStyles: {
        0: { cellWidth: 'auto', halign: 'center' },
        1: { cellWidth: 'auto', halign: 'left' },
        2: { cellWidth: 'auto' },
      },
    });

    // // Menghasilkan PDF dan memungkinkan pengguna untuk mendownloadnya
    // doc.save('kuesioner.pdf');
    return new Promise<Blob>((resolve, reject) => {
      try {
        const dataURI = doc.output('datauristring');
        const byteString = atob(dataURI.split(',')[1]);
        const byteNumbers = new Array(byteString.length);
        for (let i = 0; i < byteString.length; i++) {
          byteNumbers[i] = byteString.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: 'application/pdf' });
        resolve(blob);
      } catch (error) {
        reject(error);
      }
    });
  };

  const viewPDF = async (kuesionerData: KuesionerData) => {
    try {
      const blob = await generatePDF(kuesionerData);
      const url = URL.createObjectURL(blob);
      window.open(url, '_blank');
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };

  const downloadPDF = async (kuesionerData: KuesionerData) => {
    try {
      const blob = await generatePDF(kuesionerData);
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'kuesioner.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };

  return (
    <>
      <Container>
        {!isViewMode && <FloatingButton />}
        {isLoading && (
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              zIndex: 9999,
            }}
          >
            <ReactLoading type={'spin'} color={'#fff'} />
          </div>
        )}
        <button onClick={() => kuesionerData && viewPDF(kuesionerData)} className='fixed left-4 top-4 cursor-pointer rounded bg-blue-500 px-4 py-2 text-white shadow-md hover:bg-blue-600'>
          Unduh PDF
        </button>

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
                  <td className=''>NIP</td>
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
                    <td className='border border-black p-2 px-4 text-center text-blue-700'>Nilai</td>
                  </tr>
                </thead>
                <tbody>
                  {pertanyaanData.map((pertanyaan, index) => {
                    const pertanyaanKeys = Object.keys(pertanyaan).filter((key) => key.startsWith('pertanyaan'));
                    return pertanyaanKeys.map((key) => (
                      <tr key={`${index}_${key}`}>
                        <td className='border border-black p-2'>{pertanyaan[key]}</td>
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
                    <td className='border border-black p-2 text-center'>Jumlah (Hasil Penilaian Kinerja Guru Penggerak)</td>
                    <td className='border border-black p-2 px-4 text-center text-blue-700'>{Object.values(kuesionerData.jawaban).reduce((a, b) => a + Number(b), 0)}</td>
                  </tr>
                  <tr>
                    {(() => {
                      const total = Object.values(kuesionerData.jawaban).reduce((a, b) => a + Number(b), 0);
                      let color = '';
                      let label = '';

                      if (total >= 0 && total <= 32) {
                        color = 'text-red-600';
                        label = 'Kurang';
                      } else if (total >= 33 && total <= 64) {
                        color = 'text-yellow-600';
                        label = 'Cukup';
                      } else if (total >= 65 && total <= 96) {
                        color = 'text-blue-600';
                        label = 'Baik';
                      } else if (total >= 97 && total <= 128) {
                        color = 'text-green-600';
                        label = 'Amat Baik';
                      }
                      return <td className={`border border-black p-2 px-4 text-center ${color}`}>{label}</td>;
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

export default DataKepsek;
