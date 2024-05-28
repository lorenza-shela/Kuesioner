import React, { useState, FormEvent, useEffect, useRef } from 'react';
import { auth, db } from '../../API/firebase';
import { getFirestore, doc, setDoc, getDoc, updateDoc, collection, arrayUnion } from 'firebase/firestore';
import { getStorage, ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';
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
  const [userData, setUserData] = useState<Data | null>(null);
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
  let fileInputRef = useRef<HTMLInputElement | null>(null);

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

  const handleDownload = (fileUrl: string) => {
    window.open(fileUrl, '_blank');
  };

  const handleUploadDocument = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      const storage = getStorage();
      const storageRef = ref(storage, `users/${npsnResponden}/${file.name}`);

      // Cek apakah file adalah dokumen dan ukurannya tidak lebih dari 2MB
      if (file.size > 2 * 1024 * 1024) {
        alert('Ukuran file tidak boleh lebih dari 2MB');
        return;
      }

      // Cek apakah file memiliki ekstensi yang diizinkan (pdf, docx, atau xls/xlsx)
      const fileExtension = file.name.split('.').pop()?.toLowerCase();
      const allowedExtensions = ['pdf', 'docx', 'xls', 'xlsx', 'jpg', 'png', 'jpeg'];
      if (!fileExtension || !allowedExtensions.includes(fileExtension)) {
        alert('Hanya file dengan ekstensi .pdf, .docx, .xls, atau .xlsx .jpg .png .jpeg yang diizinkan');
        return;
      }

      // Upload dokumen ke Firebase Storage.
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          // Proses upload sedang berlangsung, Anda bisa menambahkan logika untuk menampilkan progress bar di sini.
        },
        (error) => {
          // Terjadi error saat upload, tampilkan pesan error.
          alert('Error saat upload: ' + error.message);
        },
        () => {
          // Upload selesai, dapatkan URL download dan simpan di Firestore.
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            const userRef = doc(db, 'kuesionerGuru', npsnResponden);

            setDoc(
              userRef,
              {
                kuesionerData: arrayUnion({
                  file: downloadURL,
                  namaFile: file.name,
                }),
              },
              { merge: true }
            )
              .then(() => {
                alert('Dokumen berhasil di-upload!');
                window.location.reload();
              })
              .catch((error) => {
                console.error('Error updating document: ', error);
              });
          });
        }
      );
    } else {
      alert('Harap pilih file sebelum mengunggah');
    }
  };

  const handleDeleteDocument = async (fileUrl: string, fileName: string) => {
    // Tampilkan konfirmasi sebelum menghapus
    if (!window.confirm('Apakah Anda yakin ingin menghapus file ini?')) {
      return;
    }

    // Pastikan npsnResponden adalah string
    if (typeof npsnResponden !== 'string') {
      alert('NPSN responden tidak valid');
      return;
    }

    try {
      // Hapus file dari Firebase Storage.
      const storage = getStorage();
      const fileRef = ref(storage, `users/${npsnResponden}/${fileName}`);
      await deleteObject(fileRef);

      // Hapus URL file dari Firestore.
      const userRef = doc(db, 'kuesionerGuru', npsnResponden);
      const userSnap = await getDoc(userRef);
      const lampiran = userSnap.data()?.lampiran;
      if (lampiran) {
        const updatedlampiran = lampiran.filter((doc: { file: string }) => doc.file !== fileUrl);
        await setDoc(userRef, { lampiran: updatedlampiran }, { merge: true });
      }

      alert('Dokumen berhasil dihapus');
      window.location.reload();
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('Terjadi kesalahan saat menghapus dokumen:', error);
        alert(`Dokumen gagal dihapus karena: ${error.message}`);
      }
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const formFields = [nipnuptk, npsnResponden, nama, asalSekolah, tempatTanggalLahir, jenisKelamin, pangkat, TMT, masaKerja, pendidikanTerakhir, jawaban, fileInputRef];
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
      const docRef = doc(db, 'kuesionerGuru', npsnResponden);
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
        <form className='w-full md:w-[65%]' onSubmit={handleSubmit}>
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
                      <div>
                        {/* <input type='file' ref={fileInputRef} onChange={handleUploadDocument} style={{ display: 'none' }} />
                        <button
                          onClick={() => fileInputRef.current?.click()}
                          type='button'
                          className='mt-3 mr-2 rounded-lg bg-blue-700 px-4 py-2 text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800'
                        >
                          +Tambahkan Lampiran
                        </button>
                        <td className='whitespace-nowrap px-6 py-4 text-xs font-medium text-gray-900 dark:text-white md:text-sm'>{}</td> */}
                      <input 
                      id={`lampiran-${key}`}
                      type="file" 
                      name={`${key}-${currentPage}`} 
                      className="block w-full text-sm text-slate-500
                        file:mr-4 file:py-2 file:px-4
                        file:rounded-full file:border-0
                        file:text-sm file:font-semibold
                        file:bg-violet-50 file:text-violet-700
                        hover:file:bg-violet-100
                      "/>
                      <button
                      onClick={() => fileInputRef.current?.click()}
                      type='button'
                      className='mt-3 mr-2 rounded-lg bg-blue-700 px-4 py-2 text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800'
                    >Upload</button>
                      </div>
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