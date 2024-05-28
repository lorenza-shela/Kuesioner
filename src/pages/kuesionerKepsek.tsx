'use client';
import Pagination from '../components/kepalaSekolah/pagination';
import 'tailwindcss/tailwind.css';
import data from '../API/guru.json';

export default function kepsekPage() {
  return (
    <>
      <Pagination data={data} />
    </>
  );
}
