'use client'

import { EventTypes } from "@/components/marketing/CalendarTypes";


export default function FeaturesPage() {

    return (
       <div className="flex justify-center w-full">
         <div className="flex flex-col max-w-[920px] w-full">

            {/* Header */}
           <div className="flex justify-center w-full items-center h-30">
             <h1 className="text-4xl font-bold">Features</h1>
           </div>

           {/* Content */}
            <EventTypes />
        </div>
       </div>
    );
}