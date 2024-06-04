import React from 'react';

export const NumberCard = ({number, text}: {number:number, text:string}) => {
  return (
    <div className='m-2'>
        <h2 className='font-bold text-xl'>{number}k+</h2>
        <p className='text-xl'>{text}</p>
    </div>
  )
}


