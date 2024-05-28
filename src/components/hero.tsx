'use client';
import Image from 'next/image';
import Link from 'next/link';
import TncLogo from '../../public/img/hero.png';
import Cookies from 'js-cookie';
import { useState, useEffect } from 'react';
import Tentang from '@/components/tentang';
import Tutorial from '@/components/tutorial';
import Footer from '@/components/footer';
import { motion } from 'framer-motion';
import { benefitUse, faqs, youtubeVideo } from '@/helpers/content';

function Hero() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  useEffect(() => {
    // Cek apakah pengguna sudah login
    const loggedIn = Cookies.get('nipnuptk') && Cookies.get('password');
    setIsLoggedIn(Boolean(loggedIn));
  }, []);

  return (
    <div className='bg-white'>
      <section id='hero'>
        <div className='jumbotron h-[calc(100vh-70px)] w-full bg-[#EAF7FF]'>
          <div className='container mx-auto flex h-full flex-row items-center px-6 lg:space-x-8 lg:px-12 xl:px-24'>
            <div className='flex w-full flex-col items-center justify-center space-y-5 lg:w-[50%] lg:items-start' data-aos='fade-right'>
              <Image className='block lg:hidden' src={TncLogo} width={150} height={150} alt='Logo TNC' />
              <h1 className='font-suisseNeue text-center text-2xl font-bold capitalize leading-normal text-slate-800 md:text-3xl lg:text-left lg:text-3xl lg:leading-snug xl:text-5xl xl:leading-normal'>
                Penilaian Kinerja Guru Penggerak (PKGP) <span className='block'>Di Sekolah Dasar</span>
              </h1>

              <div className='flex flex-row space-x-3'>
                {isLoggedIn ? (
                  <Link href='/dashboard'>
                    <button className='bg-primary-1 h-12 rounded-md px-4 text-sm font-semibold text-white  duration-500 hover:bg-blue-700 md:text-base'>Kembali Ke Dashboard</button>
                  </Link>
                ) : (
                  <div>
                    <Link href='/login'>
                      <button className='bg-primary-1 mr-4 h-12 rounded-md px-4 text-sm font-semibold  text-white duration-500 hover:bg-blue-700 md:text-base'>Login</button>
                    </Link>

                    <Link href='/SignUp'>
                      <button className='bg-primary-2 h-12 rounded-md px-4 text-sm font-semibold text-white duration-500 hover:bg-blue-700 md:text-base'>Belum punya akun? Daftar dulu!</button>
                    </Link>
                  </div>
                )}
              </div>
            </div>

            <div className='relative hidden items-center lg:flex lg:h-[75%] lg:w-[50%]' data-aos='fade-left'>
              <Image src={TncLogo} alt='Hero' priority={true} fill sizes='(max-width: 500px) 0vw, (max-width: 800px) 30vw, (max-width: 1200px) 40vw, 50vw' className='relative h-auto' />
            </div>
          </div>
        </div>
      </section>

      <section id='tutorial' className='my-10 py-10 capitalize'>
        <div>
          <div className='mb-16 mt-14 w-full'>
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                ease: 'easeInOut',
                duration: 0.5,
                y: { duration: 0.5 },
              }}
            >
              <Tutorial />
            </motion.div>
          </div>
          <div className='mb-10 flex justify-center'>
            <iframe width='1100' height='550' src={youtubeVideo} title='YouTube video player' frameBorder='0' allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture' allowFullScreen></iframe>
          </div>
        </div>
      </section>

      <section id='tentang' className='mb-10 mt-16'>
        <Tentang />
      </section>

      <section className='mt-10'>
        <Footer />
      </section>
    </div>
  );
}

export default Hero;
