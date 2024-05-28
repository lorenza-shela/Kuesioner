import React, { useEffect, useState } from 'react';
import DashboardLayout from './dashboardLayout';
import { db } from '../../API/firebase';
import { collection, getDocs, doc, getDoc, setDoc, deleteDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytesResumable, getDownloadURL, deleteObject, listAll } from 'firebase/storage';
import DashboardCard from './dashboardCard';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Cookies from 'js-cookie';

type UserData = {
  nama: string;
  tempatTanggalLahir: string;
  nipnuptk: string;
  jenisKelamin: string;
  unitKerja: string;
  asalSekolah: string;
  npsnResponden: string;
  profilePicture?: string;
};

export default function ContentGuru() {
  const router = useRouter();
  const [usersData, setUsersData] = useState<UserData[]>([]);
  const nipnuptk = Cookies.get('nipnuptk');
  const [documentNames, setDocumentNames] = useState<{ id: string; nama: string }[]>([]);

  useEffect(() => {
    const getDocumentNames = async () => {
      const kuesionerGuruCollection = collection(db, 'kuesionerKepSek');
      const snapshot = await getDocs(kuesionerGuruCollection);
      const names = snapshot.docs.map((doc) => ({ id: doc.id, nama: doc.data().nama }));
      setDocumentNames(names);
    };

    getDocumentNames();
  }, []);

  const deleteFolderContents = async (path: string) => {
    const storage = getStorage();
    const folderRef = ref(storage, path);

    const files = await listAll(folderRef);

    const deletionPromises = files.items.map((fileRef) => deleteObject(fileRef));

    return Promise.all(deletionPromises);
  };

  const handleDelete = async (npsnResponden: string) => {
    // Tampilkan konfirmasi sebelum menghapus
    if (!window.confirm('Apakah Anda yakin ingin menghapus dokumen ini?')) {
      return;
    }

    try {
      // Dapatkan URL foto profil dari Firestore.
      const userRef = doc(db, 'kuesionerKepSek', npsnResponden);
      const userSnap = await getDoc(userRef);
      const profilePicture = userSnap.data()?.profilePicture;

      // Hapus foto dari Firebase Storage.
      if (profilePicture) {
        const storage = getStorage();
        const profilePictureRef = ref(storage, profilePicture);
        await deleteObject(profilePictureRef);
      }

      // Hapus semua file di dalam folder
      const folderPath = `users/${npsnResponden}`;
      await deleteFolderContents(folderPath);

      // Hapus dokumen dari Firestore.
      await deleteDoc(userRef);

      // Hapus data pengguna dari state usersData.
      setUsersData(usersData.filter((user) => user.npsnResponden !== npsnResponden));

      alert('Dokumen dan foto berhasil dihapus');
      window.location.reload();
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('Terjadi kesalahan saat menghapus dokumen dan foto:', error);
        alert(`Dokumen dan foto gagal dihapus karena: ${error.message}`);
      }
    }
  };

  return (
    <DashboardLayout>
      <h1 className='mb-3 text-lg font-semibold md:text-2xl '>
        KUESIONER KINERJA GURU PENGGERAK <span className='text-sm font-light'> (Kepala Sekolah)</span>
      </h1>
      <DashboardCard borderColor='border-orange-500'>
        <h1 className='ml-2 flex items-center justify-between border-b-[1px] border-b-slate-300 px-2 py-4'>
          Data Kuesioner Kinerja Guru Penggerak
          <Link href={`/kuesionerKepsek?nipnuptk=${nipnuptk}`}>
            <button
              type='button'
              className='mr-2 rounded-lg bg-blue-700 px-4 py-2 text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800'
            >
              Tambah
            </button>
          </Link>
        </h1>

        <div className='relative overflow-x-auto shadow-md sm:rounded-lg'>
          <table className='w-full text-left text-sm text-gray-500 rtl:text-right dark:text-gray-400'>
            <thead className='bg-gray-50 text-xs uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-400'>
              <tr>
                <th scope='col' className='px-6 py-3'>
                  Nama
                </th>
                <th scope='col' className='px-6 py-3'>
                  NIP / NUPTK
                </th>
                <th scope='col' className='px-6 py-3'>
                  <span className='sr-only'>Edit</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {documentNames.map(({ id, nama }) => (
                <tr key={id} className='border-b bg-white hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-600'>
                  <td className='whitespace-nowrap px-6 py-4 text-xs font-medium text-gray-900 dark:text-white md:text-sm'>{nama}</td>
                  <td className='whitespace-nowrap px-6 py-4 text-xs font-medium text-gray-900 dark:text-white md:text-sm'>{id}</td>
                  <td className='flex-nowrapp flex items-center justify-end px-6 py-4 text-right'>
                    <Link href={`/lihatDataKepsek?nipnuptk=${nipnuptk}&documentNames=${id}`} className='text-xs font-medium text-blue-600 hover:underline dark:text-blue-500 md:text-sm'>
                      Lihat
                    </Link>
                    <Link href={`/kuesionerKepsek?nipnuptk=${nipnuptk}&documentNames=${id}`} className='ml-4 text-xs font-medium text-blue-600 hover:underline dark:text-blue-500 md:text-sm'>
                      Edit
                    </Link>
                    <button onClick={() => handleDelete(id)} className='ml-4 text-xs font-medium text-red-600 hover:underline dark:text-red-500 md:text-sm'>
                      Hapus
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </DashboardCard>
    </DashboardLayout>
  );
}
