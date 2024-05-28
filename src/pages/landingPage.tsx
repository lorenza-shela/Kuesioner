import Header from '../components/header';
import Hero from '../components/hero';
import Layout from '../app/layout';

export default function LandingPage() {
  return (
    <>
      <div className='scroll-smooth'>
        <Header />
        <Hero />
      </div>
    </>
  );
}
