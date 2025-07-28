export default function AddressBarSkeleton() {
  return (
    <div className=" w-full">

       <div className="flex justify-center w-full">
        <nav className="bg-theme-blue p-4 rounded-b-lg shadow-md flex items-center gap-4 w-full">
           <div className="text-white w-32 h-8 bg-white/30 rounded animate-pulse" />

           <div className="flex-grow h-10 bg-white/70 rounded-md animate-pulse" />

          <div className="w-20 h-10 bg-white rounded-md animate-pulse" />
        </nav>
      </div>
    </div>
  );
}
