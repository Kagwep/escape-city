import HeartIcon from 'assets/img/heart.svg?react';

export const Footer = () => {
  return (
    <footer className='mx-auto w-full max-w-prose pb-6 pl-6 pr-6 text-center text-gray-400'>
      <div className='flex flex-col items-center text sm text-gray-400'>
        {/* <a
          className='text-gray-400 text-sm hover:cursor-pointer hover:underline'
          href='/disclaimer'
        >
          Disclaimer
        </a> */}
        <a
          target='_blank'
          className='flex items-center text-sm hover:underline'
          href='https://multiversx.com/'
        >
          @Grandpa
        </a>
      </div>
    </footer>
  );
};
