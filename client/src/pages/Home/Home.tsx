import { AuthRedirectWrapper, PageWrapper } from 'wrappers';
import { Transaction } from './Transaction';

export const Home = () => {
  return (
    <AuthRedirectWrapper requireAuth={false}>
      <PageWrapper>
        <div className='flex flex-col-reverse sm:flex-row items-center h-full w-full'>
          <div className='flex items-start sm:items-center h-full sm:w-1/2 sm:bg-center'>
            <div className='flex flex-col gap-2 max-w-[70sch] text-center sm:text-left text-xl font-medium md:text-2xl lg:text-3xl'>
              <div>
                <h1 className='text-cyan-500'>Escape City</h1>
                <p className='text-blue-400'>
                  Welcome to {' '}
                  <a
                    href='https://escape-city.vercel.app'
                    target='_blank'
                    className='text-cyan-400 underline decoration-dotted hover:decoration-solid'
                  >
                    Escape City
                  </a>{' '}
                  - The ultimate escape game built on the {' '}
                  <a
                    href='https://multiversx.com/'
                    target='_blank'
                    className='text-cyan-400 underline decoration-dotted hover:decoration-solid'
                  >
                    MultiversX
                  </a>{' '}
                  blockchain.
                  <br className='hidden xl:block' />
                  Escape City offers an engaging and immersive experience where you can grow and evolve your runaways through exciting gameplay. Help your runaways escape!
                </p>
              </div>
              <p className='text-blue-500'> Connect Wallet to start</p>
            </div>
          </div>
          <div className='flex items-center justify-center h-4/6 w-1/2 bg-center'>
            <img
              src='https://res.cloudinary.com/dydj8hnhz/image/upload/v1717672134/rgf3foxdxwdpoqxdwdyn.png' // Replace with your actual image URL
              alt='Escape City'
              className='max-h-full max-w-full object-contain'
            />
          </div>
        </div>
      </PageWrapper>
    </AuthRedirectWrapper>
  );
};
