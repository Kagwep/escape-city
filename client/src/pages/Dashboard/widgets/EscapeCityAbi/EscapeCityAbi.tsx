import { useEffect, useState } from 'react';
import { faArrowUp, faArrowDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import moment from 'moment';
import { Button } from 'components/Button';
import { ContractAddress } from 'components/ContractAddress';
import { OutputContainer, PingPongOutput } from 'components/OutputContainer';
import { useGetNetworkConfig, useSendRunAway, useGetRunAway } from 'hooks';
import { SessionEnum } from 'localConstants';
import { SignedTransactionType, WidgetProps } from 'types';



export const EscapeCityAbi = ({ callbackRoute }: WidgetProps) => {

   const {network } = useGetNetworkConfig();
   const sendRunaway = useSendRunAway();
   const getRunAway = useGetRunAway();

   const onCreateRunaway = async () =>{
    if(window.confirm('Create Runaway')){
      await sendRunaway("The test runaway");
     }
  
   }

   const onGetRunAway = async () =>{
      await getRunAway(1);
   }

  return (
    <div className='flex flex-col gap-6'>
      <div className='flex flex-col gap-2'>
        <div className='flex justify-start gap-2'>
          <Button
            onClick={onCreateRunaway}
            data-testid='btnPingAbi'
            data-cy='transactionBtn'
            className='inline-block rounded-lg px-3 py-2 text-center hover:no-underline my-0 bg-blue-600 text-white hover:bg-blue-700 mr-0 disabled:bg-gray-200 disabled:text-black disabled:cursor-not-allowed'
          >
            <FontAwesomeIcon icon={faArrowUp} className='mr-1' />
            Create Runaway
          </Button>

          <Button
            onClick={onGetRunAway}
            data-cy='transactionBtn'
            className='inline-block rounded-lg px-3 py-2 text-center hover:no-underline my-0 bg-blue-600 text-white hover:bg-blue-700 mr-0 disabled:bg-gray-200 disabled:text-black disabled:cursor-not-allowed'
          >
            <FontAwesomeIcon icon={faArrowDown} className='mr-1' />
            Get Runaway
          </Button>
        </div>
      </div>

      <OutputContainer>
        <ContractAddress />
      </OutputContainer>
    </div>
  );
};
