import { useEffect, useState } from 'react';
import { collection, getDocs, Timestamp } from 'firebase/firestore';
import { PieChart, Pie, Cell, Tooltip } from 'recharts';
import { db } from '@/API/firebase'; // Ganti dengan file konfigurasi Firebase Anda
import Layout from '@/components/dashboard/dashboardLayout';
import Card from '@/components/dashboard/dashboardCard';
type AksiNyata = {
  file: string;
  tanggalUnggah: Timestamp;
  topik: string;
  namaFile: string;
};

type TeacherRanking = {
  nama: string;
  tempatTanggalLahir: string;
  nipnuptk: string;
  jenisKelamin: string;
  unitKerja: string;
  asalSekolah: string;
  npsnResponden: string;
  profilePicture?: string;
  aksiNyata?: AksiNyata[];
  certificateCount?: number; // Jumlah sertifikat
};

async function getTeacherRankings() {
  const teacherRankings: TeacherRanking[] = [];

  // Dapatkan semua dokumen dalam collection 'kuesionerKepSek'
  const querySnapshot = await getDocs(collection(db, 'kuesionerKepSek'));

  querySnapshot.forEach((doc) => {
    const data = doc.data() as TeacherRanking;

    // Hitung jumlah sertifikat untuk setiap guru
    const certificateCount = data.aksiNyata ? data.aksiNyata.length : 0;

    // Tambahkan guru dan jumlah sertifikatnya ke array
    teacherRankings.push({
      ...data,
      certificateCount,
    });
  });

  // Urutkan array berdasarkan jumlah sertifikat dalam urutan menurun
  teacherRankings.sort((a, b) => (b.certificateCount || 0) - (a.certificateCount || 0));

  return teacherRankings;
}

export default function TeacherRankings() {
  const [rankings, setRankings] = useState<TeacherRanking[]>([]);

  useEffect(() => {
    getTeacherRankings().then(setRankings);
  }, []);

  // Warna untuk diagram pie
  const COLORS = [
    '#0088FE',
    '#00C49F',
    '#FFBB28',
    '#FF8042', // Warna asli
    '#E6194B',
    '#3CB44B',
    '#FFE119',
    '#4363D8', // Warna tambahan
    '#F58231',
    '#911EB4',
    '#46F0F0',
    '#F032E6',
    '#BCF60C',
    '#FABEBE',
    '#008080',
    '#E6BEFF',
    '#9A6324',
    '#FFFAC8',
    '#800000',
    '#AAFFC3',
    '#808000',
    '#FFD8B1',
    '#000075',
    '#808080',
    '#FFFFFF',
    '#000000',
  ];

  return (
    <Layout>
      <Card borderColor='border-orange-500'>
        <div className='flex flex-col'>
          <h1 className='mt-4 text-center text-2xl font-bold'>Peringkat Guru</h1>
          <div className='flex items-center justify-between'>
            <div className='flex overflow-x-auto'>
              <table className='w-full divide-y divide-gray-200'>
                <thead className='bg-gray-50'>
                  <tr>
                    <th className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500'>Nama</th>
                    <th className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500'>Jumlah Sertifikat</th>
                    <th className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500'>warna</th>
                  </tr>
                </thead>
                <tbody className='divide-y divide-gray-200 bg-white'>
                  {rankings.map((ranking, index) => (
                    <tr key={index}>
                      <td className='whitespace-nowrap px-6 py-4'>{ranking.nama}</td>
                      <td className='whitespace-nowrap px-6 py-4'>{ranking.certificateCount}</td>
                      <td className='whitespace-nowrap px-6 py-4'>
                        <div className='h-4 w-4' style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className='flex'>
              <PieChart width={400} height={400} className=''>
                <Pie data={rankings} cx={200} cy={200} labelLine={false} outerRadius={180} fill='#8884d8' dataKey='certificateCount'>
                  {rankings.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </div>
          </div>
        </div>
      </Card>
    </Layout>
  );
}
