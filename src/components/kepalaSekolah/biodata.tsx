// Biodata.js
import React from 'react';
import Card from './card';

interface BiodataProps {
  npsnResponden: string;
  setNipNuptk: (npsnNipNuptk: string) => void;
  nama: string;
  setNama: (nama: string) => void;
  asalSekolah: string;
  setAsalSekolah: (asalSekolah: string) => void;
  tempatTanggalLahir: string;
  setTempatTanggalLahir: (tempatTanggalLahir: string) => void;
  jenisKelamin: string;
  setJenisKelamin: (jenisKelamin: string) => void;
  pangkat: string;
  setPangkat: (pangkat: string) => void;
  TMT: string;
  setTMT: (TMT: string) => void;
  masaKerja: string;
  setMasaKerja: (masaKerja: string) => void;
  pendidikanTerakhir: string;
  setPendidikanTerakhir: (pendidikanTerakhir: string) => void;
}

const Biodata: React.FC<BiodataProps> = ({
  npsnResponden,
  setNipNuptk,
  nama,
  setNama,
  asalSekolah,
  setAsalSekolah,
  tempatTanggalLahir,
  setTempatTanggalLahir,
  jenisKelamin,
  setJenisKelamin,
  pangkat,
  setPangkat,
  TMT,
  setTMT,
  masaKerja,
  setMasaKerja,
  pendidikanTerakhir,
  setPendidikanTerakhir,
}) => {
  return (
    <div>
      <Card>
        <label htmlFor='npsn' className='mb-2 block text-sm font-medium text-gray-900 dark:text-white'>
          NIP
        </label>
        <input
          type='text'
          name='npsn'
          id='npsn'
          className='focus:ring-primary-600 focus:border-primary-600 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500 sm:text-sm'
          placeholder='NIP'
          required={true}
          value={npsnResponden}
          onChange={(e) => setNipNuptk(e.target.value)}
        />
      </Card>
      <Card>
        <label htmlFor='nama' className='mb-2 block text-sm font-medium text-gray-900 dark:text-white'>
          Nama
        </label>
        <input
          type='text'
          name='nama'
          id='nama'
          className='focus:ring-primary-600 focus:border-primary-600 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500 sm:text-sm'
          placeholder='Nama'
          required={true}
          value={nama}
          onChange={(e) => setNama(e.target.value)}
        />
      </Card>
      <Card>
        <label htmlFor='asalSekolah' className='mb-2 block text-sm font-medium text-gray-900 dark:text-white'>
          Asal Sekolah
        </label>
        <input
          type='text'
          name='asalSekolah'
          id='asalSekolah'
          className='focus:ring-primary-600 focus:border-primary-600 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500 sm:text-sm'
          placeholder='Asal Sekolah'
          required={true}
          value={asalSekolah}
          onChange={(e) => setAsalSekolah(e.target.value)}
        />
      </Card>
      <Card>
        <label htmlFor='tempatTanggalLahir'>Tempat Tanggal Lahir</label>
        <input
          type='text'
          name='tempatTanggalLahir'
          className='focus:ring-primary-600 focus:border-primary-600 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500 sm:text-sm'
          placeholder='Tempat Tanggal Lahir'
          id='tempatTanggalLahir'
          required={true}
          value={tempatTanggalLahir}
          onChange={(e) => setTempatTanggalLahir(e.target.value)}
        />
      </Card>

      <Card>
        <label htmlFor='jenisKelamin'>Jenis Kelamin</label>
        <input
          type='text'
          name='jenisKelamin'
          className='focus:ring-primary-600 focus:border-primary-600 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500 sm:text-sm'
          placeholder='Jenis Kelamin'
          id='jenisKelamin'
          required={true}
          value={jenisKelamin}
          onChange={(e) => setJenisKelamin(e.target.value)}
        />
      </Card>

      <Card>
        <label htmlFor='pangkat'>Pangkat/Gol</label>
        <input
          type='text'
          name='pangkat'
          className='focus:ring-primary-600 focus:border-primary-600 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500 sm:text-sm'
          placeholder='Pangkat/Gol'
          id='pangkat'
          required={true}
          value={pangkat}
          onChange={(e) => setPangkat(e.target.value)}
        />
      </Card>

      <Card>
        <label htmlFor='TMT'>TMT Sebagai Guru Penggerak</label>
        <input
          type='text'
          name='TMT'
          className='focus:ring-primary-600 focus:border-primary-600 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500 sm:text-sm'
          placeholder='TMT Sebagai Guru Penggerak'
          id='TMT'
          required={true}
          value={TMT}
          onChange={(e) => setTMT(e.target.value)}
        />
      </Card>

      <Card>
        <label htmlFor='masaKerja'>Masa Kerja</label>
        <input
          type='text'
          name='masaKerja'
          className='focus:ring-primary-600 focus:border-primary-600 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500 sm:text-sm'
          placeholder='Masa Kerja'
          id='masaKerja'
          required={true}
          value={masaKerja}
          onChange={(e) => setMasaKerja(e.target.value)}
        />
      </Card>

      <Card>
        <label htmlFor='pendidikanTerakhir'>Pendidikan Terakhir</label>
        <input
          type='text'
          name='pendidikanTerakhir'
          className='focus:ring-primary-600 focus:border-primary-600 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500 sm:text-sm'
          placeholder='Pendidikan Terakhir'
          id='pendidikanTerakhir'
          required={true}
          value={pendidikanTerakhir}
          onChange={(e) => setPendidikanTerakhir(e.target.value)}
        />
      </Card>
    </div>
  );
};

export default Biodata;
