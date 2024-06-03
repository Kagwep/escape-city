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
      <div className='flex flex-col gap-6 max-w-3xl w-full'>
        {WIDGETS.map((element) => (
          <Widget key={element.title} {...element} />
        ))}
        <SvgDisplay dna={611235152154654615464} />
      </div>
      
    </AuthRedirectWrapper>
  );
};
