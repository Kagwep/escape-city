import { contractAddress } from 'config';
import { AuthRedirectWrapper } from 'wrappers';
import {
  Account,
  EscapeCityAbi,

  Transactions
} from './widgets';
import { useScrollToElement } from 'hooks';
import { Widget } from './components';
import { WidgetType } from 'types/widget.types';
import SvgDisplay from './components/RunAway';
import { IconButton } from 'components/Views';
import { NumberCard } from 'components/Views';
import { BsFillRocketTakeoffFill } from 'react-icons/bs';
import runaway from 'assets/img/runaway.png'

const WIDGETS: WidgetType[] = [
  {
    title: 'Account',
    widget: Account,
    description: 'Connected account details',
    reference: 'https://docs.multiversx.com/sdk-and-tools/sdk-dapp/#account'
  },
  {
    title: 'EscapeCity (ABI)',
    widget: EscapeCityAbi,
    description:
      'Smart Contract interactions using the ABI generated transactions',
    reference:
      'https://docs.multiversx.com/sdk-and-tools/sdk-js/sdk-js-cookbook/#using-interaction-when-the-abi-is-available',
    anchor: 'ping-pong-abi'
  },
 
  {
    title: 'Transactions (All)',
    widget: Transactions,
    description: 'List transactions for the connected account',
    reference:
      'https://api.elrond.com/#/accounts/AccountController_getAccountTransactions'
  },
  {
    title: 'Transactions (EscapeCity)',
    widget: Transactions,
    props: { receiver: contractAddress },
    description: 'List transactions filtered for a given Smart Contract',
    reference:
      'https://api.elrond.com/#/accounts/AccountController_getAccountTransactions'
  }
];

export const Dashboard = () => {
  useScrollToElement();

  return (
    <AuthRedirectWrapper>


      
      <div className='flex flex-col gap-6 max-w-fit w-full'>

      <section className='lg:flex lg:justify-between gap-12 p-7 lg:p-36 lg:px-20 bg-blue-950 w-full'>
          <article className='lg:w-1/2 text-white'>
            <h1 className='font-bold my-7 text-2xl lg:text-4xl leading-tight text-cyan-400'>Discover Digital Art & Collect NFTs</h1>
            <p className='capitalize text-xl'>Collect, buy and sell art from more than 370k NFT artists.</p>
            <IconButton style="mx-auto bg-blue-900" icon={<BsFillRocketTakeoffFill />} text="Get Started" />
            <div className='lg:flex justify-between mt-10'>
              <NumberCard number={240} text="Total Sale" />
              <NumberCard number={100} text="Auctions" />
              <NumberCard number={440} text="Artists" />
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

        {WIDGETS.map((element) => (
          <Widget key={element.title} {...element} />
        ))}
        <SvgDisplay dna={611235152154654615464} />
      </div>
      
    </AuthRedirectWrapper>
  );
};
