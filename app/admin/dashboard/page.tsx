"use client"
import Card from "../ui/dashboard/card"
import FloatingButton from "../ui/dashboard/addbtn"


export default function DashboardPage (){
  return (
    <>
      
      <div className="flex justify-center mt-7">
          <div className="flex items-center gap-2 w-full max-w-md mx-auto mt-8 px-4">
            <h1 className="text-gray-500"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
</svg>
</h1>
            <input  
             type="text"
             placeholder="Search..."
             className="flex-grow px-4 py-2 rounded border border-gray-300 bg-transparent focus:outline-none focus:border-blue-500 placeholder-gray-400"
             />
          </div>
      </div>
      <div className='m-10'>
        <h1 className='text-2xl  my-5 border-b-2 '>Starter </h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 ">
           
              <Card/>
              <Card/>
              <Card/>
              <Card/>
              <Card/>
              <Card/>
              <Card/>
              <Card/>
            
            </div>
      </div> 

      <FloatingButton/>
    </>
   )
}

