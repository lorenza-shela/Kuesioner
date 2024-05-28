import { useEffect, useState, useRef } from 'react';
import ReactLoading from 'react-loading';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';
import { db } from '../../API/firebase';
import DashboardLayout from './dashboardLayout';
import DashboardCard from './dashboardCard';
import Cookies from 'js-cookie';
import 'tailwindcss/tailwind.css';

type UserData = {
  alamat: string;
  jabatan: string;
  nama: string;
  npsn: string;
  nipnuptk: string;
  ttl: string;
  alamatUnit: string;
  pangkat: string;
  unitKerja: string;
};

export default function Dashboard() {
  const nipnuptk = Cookies.get('nipnuptk');
  const [userData, setUserData] = useState<UserData | null>(null);
  const [profilePicture, setProfilePicture] = useState(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);

  const handleClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    setLoading(true);
    const nipnuptk = Cookies.get('nipnuptk');

    if (event.target.files && typeof nipnuptk === 'string') {
      const file = event.target.files[0];
      const storage = getStorage();
      const storageRef = ref(storage, 'users/' + nipnuptk + '/profilePicture');

      // Dapatkan URL foto profil lama dari Firestore.
      const userRef = doc(db, 'users', nipnuptk);
      const userSnap = await getDoc(userRef);
      const oldProfilePicture = userSnap.data()?.profilePicture;

      // Hapus foto lama dari Firebase Storage.
      if (oldProfilePicture) {
        const oldProfilePictureRef = ref(storage, oldProfilePicture);
        await deleteObject(oldProfilePictureRef);
      }

      // Upload foto baru ke Firebase Storage.
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          // Proses upload sedang berlangsung, Anda bisa menambahkan logika untuk menampilkan progress bar di sini.
        },
        (error) => {
          // Terjadi error saat upload, tampilkan pesan error.
          alert('Error saat upload: ' + error.message);
          console.log(error.message);
          setLoading(false);
        },
        () => {
          // Upload selesai, dapatkan URL download dan simpan di Firestore.
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setLoading(false);
            setDoc(userRef, { profilePicture: downloadURL }, { merge: true })
              .then(() => {
                alert('Foto berhasil di-upload!');
                window.location.reload();
              })
              .catch((error) => {
                console.error('Error updating document: ', error);
              });
          });
        }
      );
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (typeof nipnuptk === 'string') {
        const docRef = doc(db, 'users', nipnuptk);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists() && docSnap.data().profilePicture) {
          setProfilePicture(docSnap.data().profilePicture);
        }
      }
    };

    fetchData();
  }, [nipnuptk]);

  useEffect(() => {
    const fetchData = async () => {
      if (typeof nipnuptk === 'string') {
        const docRef = doc(db, 'users', nipnuptk);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setUserData(docSnap.data() as UserData);
        }
      }
    };

    fetchData();
  }, [nipnuptk]);

  return (
    <DashboardLayout>
      <DashboardCard borderColor='border-blue-400'>
        <h1 className='border-b-[1px] border-b-slate-300 px-2 py-4'>Biodata Users</h1>
        <div className='mx-2 mb-3 h-full w-full p-2 text-xs font-normal md:text-base md:last:font-medium'>
          <div className='flex w-full items-center'>
            <div className='cursor-pointer'>
              <input type='file' ref={fileInputRef} onChange={handleUpload} style={{ display: 'none' }} />
              <div role='status' onClick={handleClick} className='mr-10 flex h-56 max-w-sm items-center justify-center rounded-lg bg-gray-300 dark:bg-gray-700 md:w-60'>
                {loading ? (
                  <ReactLoading type={'spin'} color={'#000'} height={50} width={50} />
                ) : profilePicture ? (
                  <img src={profilePicture} alt='Profile' className='h-full w-full' />
                ) : (
                  <h1 className='h-10 w-full text-center text-gray-500 dark:text-gray-600'>Upload Foto</h1>
                )}
              </div>
            </div>

            {userData && (
              <table>
                <tr>
                  <td className=''>Nama</td>
                  <td className=' pl-8 pr-2 md:pl-12 md:pr-2'>:</td>
                  <td className='text-blue-700'>{userData.nama}</td>
                </tr>
                <tr>
                  <td className=''>Tempat Tanggal Lahir</td>
                  <td className=' pl-8 pr-2 md:pl-12 md:pr-2'>:</td>
                  <td className='text-blue-700'>{userData.ttl}</td>
                </tr>
                <tr>
                  <td className=''>NIP / NUPTK</td>
                  <td className=' pl-8 pr-2 md:pl-12 md:pr-2'>:</td>
                  <td className='text-blue-700'>{userData.nipnuptk}</td>
                </tr>
                <tr>
                  <td className=''>Jenis Kelamin</td>
                  <td className=' pl-8 pr-2 md:pl-12 md:pr-2'>:</td>
                  <td className='text-blue-700'>{userData.alamat}</td>
                </tr>
                <tr>
                  <td className=''>Unit Kerja</td>
                  <td className=' pl-8 pr-2 md:pl-12 md:pr-2'>:</td>
                  <td className='text-blue-700'>{userData.unitKerja}</td>
                </tr>
                <tr>
                  <td className=''>Alamat Unit Kerja</td>
                  <td className=' pl-8 pr-2 md:pl-12 md:pr-2'>:</td>
                  <td className='text-blue-700'>{userData.alamatUnit}</td>
                </tr>
              </table>
            )}
          </div>
        </div>
      </DashboardCard>
    </DashboardLayout>
  );
}
