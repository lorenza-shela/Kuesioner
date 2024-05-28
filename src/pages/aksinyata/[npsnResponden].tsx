import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { getStorage, ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';
import { doc, setDoc, getDoc, collection, getDocs, Timestamp, arrayUnion } from 'firebase/firestore';
import { db } from '@/API/firebase'; // Ganti dengan file konfigurasi Firebase Anda
import DashboardLayout from '@/components/dashboard/dashboardLayout';
import DashboardCard from '@/components/dashboard/dashboardCard';

interface UserData {
  nama: string;
  tempatTanggalLahir: string;
  nipnuptk: string;
  jenisKelamin: string;
  unitKerja: string;
  asalSekolah: string;
  npsnResponden: string;
  profilePicture?: string;
  aksiNyata?: { file: string; tanggalUnggah: Timestamp; topik: string; namaFile: string }[];
}

export default function AksiNyata() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const router = useRouter();
  const { npsnResponden } = router.query;

  const handleDownload = (fileUrl: string) => {
    window.open(fileUrl, '_blank');
  };

  const handleUploadDocument = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0 && typeof npsnResponden === 'string') {
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

      // Minta topik dari pengguna
      const topik = prompt('Masukkan topik aksi nyata:');
      if (!topik) {
        alert('Topik tidak boleh kosong');
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
            const userRef = doc(db, 'kuesionerKepSek', npsnResponden);
            const timestamp = Timestamp.now(); // Tanggal dan waktu unggah

            setDoc(
              userRef,
              {
                aksiNyata: arrayUnion({
                  topik,
                  file: downloadURL,
                  namaFile: file.name,
                  tanggalUnggah: timestamp,
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
      const userRef = doc(db, 'kuesionerKepSek', npsnResponden);
      const userSnap = await getDoc(userRef);
      const aksiNyata = userSnap.data()?.aksiNyata;
      if (aksiNyata) {
        const updatedAksiNyata = aksiNyata.filter((doc: { file: string }) => doc.file !== fileUrl);
        await setDoc(userRef, { aksiNyata: updatedAksiNyata }, { merge: true });
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

  useEffect(() => {
    const fetchData = async () => {
      if (typeof npsnResponden === 'string') {
        const userRef = doc(db, 'kuesionerKepSek', npsnResponden);
        const userSnap = await getDoc(userRef);
        setUserData(userSnap.data() as UserData);
      }
    };

    fetchData();
  }, [npsnResponden]);

  return (
    <div>
      <DashboardLayout>
        <h1 className='mb-3 text-lg font-semibold md:text-2xl '>
          AKSI NYATA KINERJA GURU PENGGERAK <span className='text-sm font-light'></span>
        </h1>
        {userData && (
          <DashboardCard borderColor='border-orange-500'>
            <h1 className='ml-2 flex items-center justify-between border-b-[1px] border-b-slate-300 px-2 py-4'>
              <div className='block'>
                Data Kuesioner Kinerja Guru Penggerak : <span className='font-semibold'>{userData.nama}</span>
              </div>
              <div>
                <input type='file' ref={fileInputRef} onChange={handleUploadDocument} style={{ display: 'none' }} />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  type='button'
                  className='mr-2 rounded-lg bg-blue-700 px-4 py-2 text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800'
                >
                  Tambah
                </button>
              </div>
            </h1>

            <div className='relative overflow-x-auto shadow-md sm:rounded-lg'>
              <table className='w-full text-left text-sm text-gray-500 rtl:text-right dark:text-gray-400'>
                <thead className='bg-gray-50 text-xs uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-400'>
                  <tr>
                    <th scope='col' className='px-6 py-3'>
                      Topik aksinyata
                    </th>
                    <th scope='col' className='px-6 py-3'>
                      File
                    </th>
                    <th scope='col' className='px-6 py-3'>
                      Tanggal Unggah
                    </th>
                    <th scope='col' className='px-6 py-3'>
                      <span className='sr-only'>Action</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {userData?.aksiNyata?.map((aksiNyata, index) => (
                    <tr key={index} className='border-b bg-white hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-600'>
                      <td className='whitespace-nowrap px-6 py-4 text-xs font-medium uppercase text-gray-900 dark:text-white md:text-sm'>{aksiNyata.topik}</td>
                      <td className='whitespace-nowrap px-6 py-4 text-xs font-medium text-gray-900 dark:text-white md:text-sm'>{aksiNyata.namaFile}</td>
                      <td className='whitespace-nowrap px-6 py-4 text-xs font-medium text-gray-900 dark:text-white md:text-sm'>
                        {aksiNyata.tanggalUnggah.toDate().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                      </td>
                      <td className='flex-nowrapp flex items-center justify-end px-6 py-4 text-right'>
                        <button onClick={() => handleDownload(aksiNyata.file)} className='text-xs font-medium text-blue-600 hover:underline dark:text-red-500 md:text-sm'>
                          Download
                        </button>
                        <button className='ml-4 text-xs font-medium text-red-600 hover:underline dark:text-red-600 md:text-sm' onClick={() => handleDeleteDocument(aksiNyata.file, aksiNyata.namaFile)}>
                          Hapus
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </DashboardCard>
        )}
      </DashboardLayout>
    </div>
  );
}
