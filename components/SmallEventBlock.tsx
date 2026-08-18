'use client'

import { FC, ReactNode } from "react";



interface SmallEventBlockProps {
  children: ReactNode
}

const SmallEventBlock: FC<SmallEventBlockProps> = ({ children }) => {
  return (
   <div className="flex flex-col border border-[#ffffff15] text-white rounded-md">
     {children}
   </div>
  );
};

export default SmallEventBlock;
