import React from "react";

export const IconButton = ({ icon, text, style, clickEvent }:{
  icon?: any;
  text?: any;
  style?: any;
  clickEvent?: any;
}) => {
  return (
    <button
      onClick={clickEvent}
      className={`${style} flex items-center gap-2 bg-purple-600 hover:cursor-pointer hover:bg-purple-500 text-white font-semibold my-7 py-4 px-6 rounded-xl`}
    >
      {icon}
      {text}
    </button>
  );
};


