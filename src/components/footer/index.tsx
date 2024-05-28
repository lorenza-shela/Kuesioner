'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import Dialog from './dialog';
import { RiMailAddLine } from 'react-icons/ri';
import { ErrorMessage, SuccessMessage } from './message';
import { addDoc, collection } from 'firebase/firestore';
import { auth, db } from '../../API/firebase';

export default function Footer() {
  const [close, setClose] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const [statusMessage, setStatusMessage] = useState('');

  const handleClose = () => {
    setClose(!close);
    setStatusMessage('');
  };

  const validateEmail = (email: string) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  };

  const handleSubmitEmail = async (e: any) => {
    e.preventDefault();

    // Validasi email
    if (!validateEmail(email)) {
      console.log('Email tidak valid');
      return;
    }

    try {
      const docRef = await addDoc(collection(db, 'message'), {
        email: email,
        name: name,
        subject: subject,
        message: message,
      });

      console.log('Document written with ID: ', docRef.id);

      // Tutup dialog dan tampilkan pesan
      handleClose();
      alert('Pesan berhasil dikirim');
    } catch (e) {
      console.error('Error adding document: ', e);
    }
  };
  return (
    <div className='w-full'>
      <Dialog
        title='Hubungi Kami'
        subtitle='Beri kami tanggapan Anda dan bantu kami meningkatkan layanan kami'
        submitText='Kirim'
        cancelText='Batal'
        onCancel={handleClose}
        onClose={handleClose}
        isLoading={isLoading}
        onSubmit={handleSubmitEmail}
        icon={<RiMailAddLine />}
        className={`${close ? 'hidden' : ''}`}
      >
        <form className='mb-2 mt-6'>
          <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
            <div className='flex flex-col gap-3'>
              <div className='flex w-full flex-col items-start gap-1'>
                <label className='font-medium'>Email</label>
                <input type='email' className='focus:border-primaryo outline-primaryo w-full rounded-lg border border-gray-300 bg-gray-50 p-2' required onChange={(e) => setEmail(e.target.value)} value={email} />
              </div>
              <div className='flex w-full flex-col items-start gap-1'>
                <label className='font-medium'>Nama</label>
                <input type='text' className='focus:border-primaryo outline-primaryo w-full rounded-lg border  border-gray-300 bg-gray-50 p-2' required onChange={(e) => setName(e.target.value)} value={name} />
              </div>
              <div className='flex w-full flex-col items-start gap-1'>
                <label className='font-medium'>Subjek</label>
                <input type='email' className='focus:border-primaryo outline-primaryo w-full rounded-lg border  border-gray-300 bg-gray-50 p-2' required onChange={(e) => setSubject(e.target.value)} value={subject} />
              </div>
            </div>
            <div className='flex w-full flex-col items-start gap-1'>
              <label className='font-medium'>Pesan</label>
              <textarea
                name='message'
                placeholder='Tolong Cantumkan Data Berikut Ini : NIP/NUPTK, Dan Nomor Whatsapp Yang Dapat Di Hubungi Jika Anda Lupa Password Dan Tidak Bisa Login. ttd:adminCR'
                className='focus:border-primaryo outline-primaryo max-row h-full w-full  resize-none rounded-lg border border-gray-300 bg-gray-50 p-2'
                rows={4}
                onChange={(e) => setMessage(e.target.value)}
                value={message}
              ></textarea>
            </div>
          </div>
        </form>

        <div className='mt-6'>{statusMessage ? statusMessage === 'Pesan berhasil dikirim' ? <SuccessMessage title={statusMessage} /> : <ErrorMessage title={statusMessage} /> : ''}</div>
      </Dialog>
      <footer className='bg-primaryo text-white'>
        <div className='mx-auto flex max-w-6xl flex-col justify-between gap-8 px-4 py-6 md:flex-row'>
          <div>
            <Image src={'/icon.png'} width={50} height={100} alt='Logo Kasa News' />
            <p className='mt-6 max-w-sm'>
              Untuk pertanyaan lebih lanjut, silahkan hubungi
              <span onClick={handleClose} className='mx-2 cursor-pointer font-bold underline'>
                admin
              </span>
              di sini.
            </p>
          </div>
          <div>
            <h1 className='mb-3 text-2xl font-bold'>PKGP</h1>
            <ul className='flex flex-col gap-3'></ul>
          </div>
        </div>
        <div className='mx-auto max-w-6xl text-center'>
          <div className='h-[1px] w-full bg-white'></div>
          <p className='mt-6 pb-5'>© 2023 PKGP. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
