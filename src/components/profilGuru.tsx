import { useEffect, useState, useRef } from 'react';
import ReactLoading from 'react-loading';
import Link from 'next/link';
import { collection, getDocs, doc, getDoc, setDoc, deleteDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytesResumable, getDownloadURL, deleteObject, listAll } from 'firebase/storage';
import { db } from '../API/firebase';
import DashboardLayout from './dashboard/dashboardLayout';
import DashboardCard from './dashboard/dashboardCard';
import { motion } from 'framer-motion';
import { RiInstagramLine, RiGithubFill, RiLinkedinBoxFill } from 'react-icons/ri';
import 'tailwindcss/tailwind.css';

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

export default function Dashboard() {
  const [usersData, setUsersData] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(false);
  const [documentNames, setDocumentNames] = useState<{ id: string; nama: string }[]>([]);
  const fileInputRef = useRef<HTMLInputElement[]>([]);

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
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('Terjadi kesalahan saat menghapus dokumen dan foto:', error);
        alert(`Dokumen dan foto gagal dihapus karena: ${error.message}`);
      }
    }
  };

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>, npsnResponden: string, index: number) => {
    setLoading(true);

    if (event.target.files) {
      const file = event.target.files[0];
      const storage = getStorage();
      const storageRef = ref(storage, 'users/' + npsnResponden + '/profilePicture');

      // Dapatkan URL foto profil lama dari Firestore.
      const userRef = doc(db, 'kuesionerKepSek', npsnResponden);
      const userSnap = await getDoc(userRef);
      const oldProfilePicture = userSnap.data()?.profilePicture;

      // Cek apakah file adalah gambar
      if (!file.type.startsWith('image/')) {
        alert('File yang diunggah harus berupa gambar');
        setLoading(false);
        return;
      }

      // Cek apakah ukuran file kurang dari 2MB
      if (file.size > 2 * 1024 * 1024) {
        alert('Ukuran file tidak boleh lebih dari 2MB');
        setLoading(false);
        return;
      }

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
      const querySnapshot = await getDocs(collection(db, 'kuesionerKepSek'));
      const data: UserData[] = [];
      querySnapshot.forEach((doc) => {
        data.push(doc.data() as UserData);
      });
      setUsersData(data);
    };

    fetchData();
  }, []);

  return (
    <DashboardLayout>
      <DashboardCard borderColor='border-blue-400'>
        <ul className='mx-4 my-8 grid grid-cols-1 gap-10 md:max-w-3xl lg:max-w-6xl lg:grid-cols-2'>
          {usersData.map((user, index) => {
            const handleClick = () => {
              if (fileInputRef.current[index]) {
                fileInputRef.current[index].click();
              }
            };

            return (
              <motion.li
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  ease: 'easeInOut',
                  duration: 0.5,
                  y: { duration: 0.5 },
                }}
                className='flex flex-col items-center gap-6 border-b pb-5 text-center sm:items-start sm:text-left md:flex-row lg:border-none'
              >
                <div>
                  <input
                    type='file'
                    ref={(el) => {
                      if (el) fileInputRef.current[index] = el;
                    }}
                    onChange={(event) => handleUpload(event, user.npsnResponden, index)}
                    style={{ display: 'none' }}
                  />
                  {user.profilePicture ? (
                    <img src={user.profilePicture} alt={user.nama} className='h-48 cursor-pointer rounded-xl object-cover object-top md:w-44' onClick={handleClick} />
                  ) : (
                    <div className='cursor-pointer'>
                      <div role='status' onClick={handleClick} className='mr-5 flex h-48 w-full items-center justify-center rounded-lg bg-gray-300 dark:bg-gray-700 md:w-44'>
                        <h1 className='h-10 w-full text-center text-gray-500 dark:text-gray-600'>Upload Foto</h1>
                      </div>
                    </div>
                  )}
                </div>
                <div className='capitalize'>
                  <div>
                    <h4 className='text-lg font-bold'>{user.nama.length > 25 ? `${user.nama.substring(0, 22)}...` : user.nama}</h4>
                    <p className=' text-base font-medium text-zinc-400'>{user.tempatTanggalLahir}</p>
                  </div>
                  <p className='mt-2 text-base font-medium'>NIP : {user.npsnResponden}</p>
                  <p className='mt-2 text-base font-medium'>Jenis Kelamin: {user.jenisKelamin}</p>
                  <p className='mt-2 text-base font-medium'>Unit Kerja : {user.asalSekolah}</p>
                  <div className='mt-2 flex justify-center gap-3 sm:justify-start'>
                    <div className='flex'>
                      <div>
                        <button onClick={() => handleDelete(user.npsnResponden)} className='bg-primary-1 mr-4 h-10 rounded-md px-4 text-sm font-semibold  text-white duration-500 hover:bg-blue-700 md:text-base'>
                          Hapus
                        </button>
                      </div>

                      <Link href={`/aksinyata/${user.npsnResponden}`}>
                        <button className='bg-primary-2 h-10 rounded-md px-4 text-sm font-semibold text-white duration-500 hover:bg-blue-700 md:text-base'>Aksi Nyata</button>
                      </Link>
                    </div>
                  </div>
                </div>
              </motion.li>
            );
          })}
        </ul>
      </DashboardCard>
    </DashboardLayout>
  );
}
