import { MxLink } from "components/MxLink";
import React from "react";
import { useGetIsLoggedIn } from 'hooks';
import { RouteNamesEnum } from "localConstants";

export const IconButton = ({ icon, text, style, clickEvent }:{
  icon?: any;
  text?: any;
  style?: any;
  clickEvent?: any;
}) => {
  const isLoggedIn = useGetIsLoggedIn();
  return (

        <MxLink
          className='px-2 text-cyan-400 hover:text-cyan-500'
          to={isLoggedIn ? RouteNamesEnum.play : RouteNamesEnum.home}
        >
            <button
                onClick={clickEvent}
                className={`${style} flex items-center gap-2 bg-purple-600 hover:cursor-pointer hover:bg-purple-500 text-white font-semibold my-7 py-4 px-6 rounded-xl`}
              >
                {icon}
                {text}
            </button>
        </MxLink>
  );
};


