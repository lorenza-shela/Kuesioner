import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../API/firebase';
import DashboardLayout from './dashboardLayout';
import DashboardCard from './dashboardCard';
import Cookies from 'js-cookie';
import 'tailwindcss/tailwind.css';
import { FiEdit2, FiSave } from 'react-icons/fi';
import Link from 'next/link';

type UserData = {
  alamat: string;
  jabatan: string;
  nama: string;
  npsn: string;
  nipnuptk: string;
  pangkat: string;
  unitKerja: string;
};

export default function Dashboard() {
  const router = useRouter();
  const nipnuptk = Cookies.get('nipnuptk');
  const [userData, setUserData] = useState<UserData | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [editedNama, setEditedNama] = useState('');
  const [editedNipnuptk, setEditedNipnuptk] = useState('');
  const [editedAlamat, setEditedAlamat] = useState('');
  const [editedJabatan, setEditedJabatan] = useState('');
  const [editedPangkat, setEditedPangkat] = useState('');
  const [editedUnitKerja, setEditedUnitKerja] = useState('');
  const [editedNpsn, setEditedNpsn] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      if (typeof nipnuptk === 'string') {
        const docRef = doc(db, 'users', nipnuptk);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data() as UserData;
          setUserData(data);
          setEditedNama(data.nama);
          setEditedNipnuptk(data.nipnuptk);
          setEditedAlamat(data.alamat);
          setEditedJabatan(data.jabatan);
          setEditedPangkat(data.pangkat);
          setEditedUnitKerja(data.unitKerja);
          setEditedNpsn(data.npsn);
        }
      }
    };

    fetchData();
  }, [nipnuptk]);

  const handleNamaChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEditedNama(event.target.value);
  };

  const handleNipnuptkChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEditedNipnuptk(event.target.value);
  };

  const handleAlamatChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEditedAlamat(event.target.value);
  };

  const handleJabatanChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEditedJabatan(event.target.value);
  };

  const handlePangkatChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEditedPangkat(event.target.value);
  };

  const handleUnitKerjaChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEditedUnitKerja(event.target.value);
  };

  const handleNpsnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEditedNpsn(event.target.value);
  };

  const handleSave = async () => {
    if (typeof nipnuptk === 'string') {
      const userRef = doc(db, 'users', nipnuptk);
      await updateDoc(userRef, {
        nama: editedNama,
        nipnuptk: editedNipnuptk,
        alamat: editedAlamat,
        jabatan: editedJabatan,
        pangkat: editedPangkat,
        unitKerja: editedUnitKerja,
        npsn: editedNpsn,
      });

      window.alert('Data berhasil diubah!');
      window.location.reload();
    }

    setEditMode(false);
  };

  return (
    <DashboardLayout>
      <h1 className='mb-3 text-lg font-semibold md:text-2xl'>
        Pejabat Penilai (Kepala Sekolah)
        <span className='text-sm font-light'> </span>
      </h1>

      <DashboardCard borderColor='border-blue-400'>
        <div className='flex items-center justify-between border-b-[1px] border-b-slate-300 py-4'>
          <div>
            <h1 className=' mx-2'>Biodata </h1>
          </div>
          <div className=''>
            {editMode ? (
              <button type='button' className='mx-4' onClick={handleSave}>
                <FiSave />
              </button>
            ) : (
              <button type='button' className='mx-4' onClick={() => setEditMode(true)}>
                <FiEdit2 />
              </button>
            )}
          </div>
        </div>
        <div className='mx-2 mb-3 h-full w-full p-2 text-xs font-normal capitalize md:text-base md:last:font-medium'>
          {editMode ? (
            <form>
              <table>
                <tr>
                  <td className=''>Nama</td>
                  <td className=' pl-8 pr-2 md:pl-12 md:pr-2'>:</td>
                  <td className='text-blue-700'>
                    <input className='border-none p-0 capitalize focus:border-none focus:outline-none' type='text' value={editedNama} onChange={handleNamaChange} />
                  </td>
                </tr>
                <tr>
                  <td className=''>NIP / NUPTK</td>
                  <td className=' pl-8 pr-2 md:pl-12 md:pr-2'>:</td>
                  <td className='text-blue-700'>
                    <input className='border-none p-0 capitalize focus:border-none focus:outline-none' type='text' value={editedNipnuptk} readOnly />
                  </td>
                </tr>

                <tr>
                  <td className=''>Alamat</td>
                  <td className=' pl-8 pr-2 md:pl-12 md:pr-2'>:</td>
                  <td className='text-blue-700'>
                    <input className='border-none p-0 capitalize focus:border-none focus:outline-none' type='text' value={editedAlamat} onChange={handleAlamatChange} />
                  </td>
                </tr>
                <tr>
                  <td className=''>Jabatan</td>
                  <td className=' pl-8 pr-2 md:pl-12 md:pr-2'>:</td>
                  <td className='text-blue-700'>
                    <input className='border-none p-0 capitalize focus:border-none focus:outline-none' type='text' value={editedJabatan} onChange={handleJabatanChange} />
                  </td>
                </tr>
                <tr>
                  <td className=''>Pangkat / Golongan Ruang</td>
                  <td className=' pl-8 pr-2 md:pl-12 md:pr-2'>:</td>
                  <td className='text-blue-700'>
                    <input className='border-none p-0 capitalize focus:border-none focus:outline-none' type='text' value={editedPangkat} onChange={handlePangkatChange} />
                  </td>
                </tr>
                <tr>
                  <td className=''>Unit Kerja</td>
                  <td className=' pl-8 pr-2 md:pl-12 md:pr-2'>:</td>
                  <td className='text-blue-700'>
                    <input className='border-none p-0 capitalize focus:border-none focus:outline-none' type='text' value={editedUnitKerja} onChange={handleUnitKerjaChange} />
                  </td>
                </tr>
                <tr>
                  <td className=''>NPSN</td>
                  <td className=' pl-8 pr-2 md:pl-12 md:pr-2'>:</td>
                  <td className='text-blue-700'>
                    <input className='border-none p-0 capitalize focus:border-none focus:outline-none' type='text' value={editedNpsn} onChange={handleNpsnChange} />
                  </td>
                </tr>
              </table>
            </form>
          ) : (
            userData && (
              <table>
                <tr>
                  <td className=''>Nama</td>
                  <td className=' pl-8 pr-2 md:pl-12 md:pr-2'>:</td>
                  <td className='text-blue-700'>{userData.nama}</td>
                </tr>
                <tr>
                  <td className=''>NIP / NUPTK</td>
                  <td className=' pl-8 pr-2 md:pl-12 md:pr-2'>:</td>
                  <td className='text-blue-700'>{userData.nipnuptk}</td>
                </tr>
                <tr>
                  <td className=''>Alamat</td>
                  <td className=' pl-8 pr-2 md:pl-12 md:pr-2'>:</td>
                  <td className='text-blue-700'>{userData.alamat}</td>
                </tr>
                <tr>
                  <td className=''>Jabatan</td>
                  <td className=' pl-8 pr-2 md:pl-12 md:pr-2'>:</td>
                  <td className='text-blue-700'>{userData.jabatan}</td>
                </tr>
                <tr>
                  <td className=''>Pangkat / Golongan Ruang</td>
                  <td className=' pl-8 pr-2 md:pl-12 md:pr-2'>:</td>
                  <td className='text-blue-700'>{userData.pangkat}</td>
                </tr>
                <tr>
                  <td className=''>Unit Kerja</td>
                  <td className=' pl-8 pr-2 md:pl-12 md:pr-2'>:</td>
                  <td className='text-blue-700'>{userData.unitKerja}</td>
                </tr>
                <tr>
                  <td className=''>NPSN</td>
                  <td className=' pl-8 pr-2 md:pl-12 md:pr-2'>:</td>
                  <td className='text-blue-700'>{userData.npsn}</td>
                </tr>
                <Link href='/resetPassword'>
                  <button className='mt-4 cursor-pointer rounded bg-blue-500 px-4 py-2 text-white shadow-md hover:bg-blue-600'>Reset Password</button>
                </Link>
              </table>
            )
          )}
        </div>
      </DashboardCard>
    </DashboardLayout>
  );
}
