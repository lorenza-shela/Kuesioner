import React from 'react';
import { useRouter } from 'next/router';

const FloatingButton: React.FC = () => {
  const router = useRouter();
  const { nipnuptk } = router.query;

  const handleBackToDashboard = () => {
    router.push({
      pathname: '/dashboard',
    });
  };

  return (
    <button onClick={handleBackToDashboard} className='fixed right-4 top-4 cursor-pointer rounded bg-blue-500 px-4 py-2 text-white shadow-md hover:bg-blue-600'>
      Kembali Ke Dashboard
    </button>
  );
};

export default FloatingButton;
