import { AuthRedirectWrapper, PageWrapper } from 'wrappers';
import { Transaction } from './Transaction';
import { useScrollToElement } from 'hooks';
import { IconButton } from 'components/Views';
import { NumberCard } from 'components/Views';
import { BsFillRocketTakeoffFill } from 'react-icons/bs';
import runaway from 'assets/img/runaway.png'

export const Home = () => {
  return (
    <AuthRedirectWrapper requireAuth={false}>
 
      <div className='flex flex-col gap-6 max-w-fit w-full'>

      <section className='lg:flex lg:justify-between gap-12 p-7 lg:p-36 lg:px-20 bg-blue-950 w-full'>
          <article className='lg:w-1/2 text-white'>
            <h1 className='font-bold my-7 text-2xl lg:text-4xl leading-tight text-cyan-400'>Play & Collect NFTs</h1>
            <p className='capitalize text-xl'>Collect, buy and sell Runaway tokens from more an engaging gameplay.</p>
            <IconButton style="mx-auto bg-cyan-900" icon={<BsFillRocketTakeoffFill />} text="Get Started" />
            <div className='lg:flex justify-between mt-10'>
              <NumberCard number={''} text="Total Sale" />
              <NumberCard number={''} text="Auctions" />

            </div>
          </article>
          <article className='mx-auto w-96 rounded-2xl text-left bg-blue-900 overflow-hidden'>
              <img className='w-96 rounded-2xl hover:cursor-pointer transition-transform duration-300 hover:scale-105' src={runaway} alt="AutumnMxse is an NFT artwork created by artist GxngYxng" loading="lazy" />
                <h3 className='font-bold text-xl ml-3 mt-3 text-white'>Runaway</h3>
                <div className='flex gap-2 ml-3 mb-3 pb-3 text-white'>
                  <img className='w-5 rounded-full' src={runaway} alt="Artist GxngYxng's headshot" loading="lazy"/>
                  <span>escapecity</span>
                </div>
          </article>
        </section>

        
      </div>
      
    </AuthRedirectWrapper>
  );
};
