'use client'
import Image from "next/image";


type CardProps = {
  itemname: string;
  itemprice: number;
  onClick?: () => void; 

};

export default function Card({ itemname, itemprice  , onClick}: CardProps) {

 
  return (
    <>
      <div className="max-w-xs rounded-2xl overflow-hidden shadow-lg bg-white relative">
      
        <div className="relative w-full h-48" >
          <Image
            src="/images/burger.jpg"
            alt="Product"
            layout="fill"
            objectFit="cover"
            className="rounded-2xl"
          />
        </div>

        <div className="p-4 flex flex-row justify-between items-center">
         <p className="text-lg font-semibold text-gray-800">{itemname}</p> 
         <p className="text-lg text-gray-600">Rs. {itemprice.toLocaleString()}</p>

          <button onClick={onClick}>
             <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-5 h-5 text-gray-600"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
              />
            </svg> </button>
        </div>
      </div>


   
    </>  
  );
}
