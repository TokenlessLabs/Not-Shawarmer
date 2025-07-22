'use client'
import Image from "next/image";
import { useState } from "react";

type CardProps = {
  itemname: string;
  itemprice: number;
};

export default function Card({ itemname, itemprice }: CardProps) {
const [showEdit , setshowEdit] =useState(false);
 const [showUpload, setShowUpload] = useState(false);
 const [statusIndex, setStatusIndex] = useState(0);

   const statuses = [
    { label: "Available", color: "bg-yellow-100 text-yellow-800" },
    { label: "Unavailable", color: "bg-red-100 text-red-800" },
   
  ];
    const handleStatusClick = () => {
    const nextIndex = (statusIndex + 1) % statuses.length;
    setStatusIndex(nextIndex);
  };

  const currentStatus = statuses[statusIndex];
 
  return (
    <>
      <div className="max-w-xs rounded-2xl overflow-hidden shadow-lg bg-white relative">
      
        <div className={`relative w-full h-48 ${showEdit ? 'blur-sm' : ''}`}>
          <Image
            src="/images/burger.jpg"
            alt="Product"
            layout="fill"
            objectFit="cover"
            className="rounded-2xl"
          />
        
          <button
            onClick={() => setShowUpload(true)}
            className="absolute bottom-2 right-2 bg-white p-1 rounded-full shadow-md hover:bg-gray-100 z-10"
          >
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
            </svg>
          </button>
        </div>

        <div className="p-4 flex flex-row justify-between items-center">
         <p className="text-lg font-semibold text-gray-800">{itemname}</p> 
         <p className="text-lg text-gray-600">Rs. {itemprice.toLocaleString()}</p>

          <button onClick={() => setshowEdit(true)}>
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


    { showEdit && (
         <div className="fixed inset-0 z-40 flex justify-center items-center">
                  <div className="bg-theme-light-blue p-6 rounded-xl shadow-2xl w-[90%] max-w-md">
                    <h2 className="text-xl font-semibold mb-4">Add Item to Menu</h2>
                    <div className="w-full h-52 relative">
                            <Image
                              src="/images/burger.jpg "
                              alt="Item Image"
                              layout="fill"
                              objectFit="cover"
                              className="rounded-2xl "
                            />
                          </div>
                    <div className="space-y-4">
                      <label className="block">
                        <span className="block mb-1 font-medium">Name:</span>
                        <input
                          type="text"
                          placeholder="Enter item name"
                          className="w-full p-2 rounded shadow-xl"
                        />
                      </label>
                      <label className="block">
                        <span className="block mb-1 font-medium">Price:</span>
                        <input
                          type="number"
                          placeholder="Enter price"
                          className="w-full p-2 rounded shadow-xl"
                        />
                      </label>
                      <label className="block">
                        <span className="block mb-1 font-medium">Category:</span>
                        <input
                          type="text"
                          placeholder="Enter category"
                          className="w-full p-2 rounded shadow-xl"
                        />
                      </label>

 <div
  className={`${currentStatus.color} text-sm font-medium px-3 py-1 rounded-full cursor-pointer flex items-center space-x-2 w-fit`}
>
            <span>{currentStatus.label}</span>
            <button onClick={handleStatusClick}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none" viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-4 h-4"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 8.689c0-.864.933-1.406 1.683-.977l7.108 4.061a1.125 1.125 0 010 1.954l-7.108 4.061A1.125 1.125 0 013 16.811V8.69ZM12.75 8.689c0-.864.933-1.406 1.683-.977l7.108 4.061a1.125 1.125 0 010 1.954l-7.108 4.061a1.125 1.125 0 01-1.683-.977V8.69Z" />
              </svg>
            </button>
          </div>
                    </div> 

                    <div className="mt-6 flex justify-end space-x-3">
                      <button
                        onClick={() => setshowEdit(false)}
                        className="bg-red-500 text-white font-bold px-4 py-2 rounded shadow-xl hover:px-5 hover:bg-red-700 transition-all duration-200"
                      >
                        Close
                      </button>
                     
                      <button
                        onClick={() => setshowEdit(false)}
                        className="bg-theme-blue text-white font-bold px-4 py-2 rounded shadow-xl hover:px-5 hover:bg-theme-dark-blue transition-all duration-200"
                      >
                        Edit Item
                      </button>
                      <button
                        onClick={() => setshowEdit(false)}
                        className="bg-theme-blue text-white font-bold px-4 py-2 rounded shadow-xl hover:px-5 hover:bg-theme-dark-blue transition-all duration-200"
                      >
                        Delete Item
                      </button>
                    </div>
                  </div>
                </div>
            
      )
    }
    

    {showUpload &&(<div className="fixed inset-0 z-40 flex justify-center items-center">
                  <div className="bg-theme-light-blue p-6 rounded-xl shadow-2xl w-[90%] max-w-md">
                    <h2 className="text-xl font-semibold mb-4">Add Item to Menu</h2>
                    <div className="w-full h-52 relative bg-white rounded-xl">
                            
                              <h1 className="text-gray-500">Drop image here </h1>
                            
                          </div>
                    
                    <div className="mt-6 flex justify-end space-x-3">
                      <button
                        onClick={() => setShowUpload(false)}
                        className="bg-theme-blue text-white font-bold px-4 py-2 rounded shadow-xl hover:px-5 hover:bg-theme-dark-blue transition-all duration-200"
                      >
                         Upload Image
                      
                      </button>
                      <button
                        onClick={() => setShowUpload(false)}
                        className="bg-red-500 text-white font-bold px-4 py-2 rounded shadow-xl hover:px-5 hover:bg-theme-dark-blue transition-all duration-200"
                      >
                         Close
                      </button>
                    </div>
                  </div>
                </div>)  }
    </>  
  );
}
