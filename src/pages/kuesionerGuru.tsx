'use client';
import SurveiPage from '../components/guru/surveiPage';
import Pagination from '../components/guru/pagination';
import data from '../API/guru.json';
import 'tailwindcss/tailwind.css';

export default function guruPage() {
  return (
    <>
      <Pagination data={data} />
    </>
  );
}
