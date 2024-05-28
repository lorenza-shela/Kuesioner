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

type SchoolRanking = {
  asalSekolah: string;
  jumlahGuruPenggerak: number;
};

async function getSchoolRankings() {
  const schoolRankings: SchoolRanking[] = [];
  const schoolCounts: { [key: string]: number } = {};

  // Dapatkan semua dokumen dalam collection 'kuesionerKepSek'
  const querySnapshot = await getDocs(collection(db, 'kuesionerKepSek'));

  querySnapshot.forEach((doc) => {
    const data = doc.data();

    // Hitung jumlah guru penggerak untuk setiap sekolah
    if (data.asalSekolah) {
      // Ubah nama sekolah menjadi huruf kecil
      const schoolName = data.asalSekolah.toLowerCase().trim();

      if (schoolCounts[schoolName]) {
        schoolCounts[schoolName]++;
      } else {
        schoolCounts[schoolName] = 1;
      }
    }
  });

  // Tambahkan sekolah dan jumlah guru penggeraknya ke array
  for (const school in schoolCounts) {
    schoolRankings.push({
      asalSekolah: school,
      jumlahGuruPenggerak: schoolCounts[school],
    });
  }

  // Urutkan array berdasarkan jumlah guru penggerak dalam urutan menurun
  schoolRankings.sort((a, b) => b.jumlahGuruPenggerak - a.jumlahGuruPenggerak);

  return schoolRankings;
}

export default function SchoolRankings() {
  const [rankings, setRankings] = useState<SchoolRanking[]>([]);

  useEffect(() => {
    getSchoolRankings().then(setRankings);
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
        <div className='flex flex-col overflow-auto'>
          <h1 className='mt-4 text-center text-2xl font-bold'>Peringkat Sekolah</h1>
          <div className='block items-center justify-between md:flex'>
            <div className='flex overflow-x-auto overflow-y-auto'>
              <table className='w-full divide-y divide-gray-200'>
                <thead className='bg-gray-50'>
                  <tr>
                    <th className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500'>Nama Sekolah</th>
                    <th className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500'>Jumlah Guru Penggerak</th>
                    <th className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500'>Warna</th>
                  </tr>
                </thead>
                <tbody className='divide-y divide-gray-200 bg-white capitalize'>
                  {rankings.map((ranking, index) => (
                    <tr key={index}>
                      <td className='whitespace-nowrap px-6 py-4 uppercase'>{ranking.asalSekolah}</td>
                      <td className='whitespace-nowrap px-6 py-4'>{ranking.jumlahGuruPenggerak}</td>
                      <td className='whitespace-nowrap px-6 py-4'>
                        <div className='h-4 w-4' style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className='block overflow-auto md:flex md:flex-row'>
              <PieChart width={400} height={400} className=''>
                <Pie data={rankings} cx={200} cy={200} labelLine={false} outerRadius={180} fill='#8884d8' dataKey='jumlahGuruPenggerak'>
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
