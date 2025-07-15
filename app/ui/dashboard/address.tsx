'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';

const DynamicMap = dynamic(() => import('@/app/ui/map'), { ssr: false });

const AddressModal = ({ savedAddress }: { savedAddress?: string }) => {
  const [editing, setEditing] = useState(!savedAddress);
  const [address, setAddress] = useState(savedAddress || '');

  return (
    <div className="w-full md:w-1/2 h-72 md:h-auto">
        <DynamicMap />
      </div>
    // <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
    //   <div className="w-full max-w-lg bg-white rounded-xl overflow-hidden shadow-xl flex flex-col max-h-[90vh]">
    //     {/* Map (80% height) */}
    //     <div className="h-[60%] relative">
    //       <DynamicMap />
    //       <button
    //         onClick={() => setEditing(true)}
    //         className="absolute top-4 right-4 bg-white px-3 py-1 rounded-md shadow text-sm font-medium text-theme-dark-blue hover:bg-gray-100 transition"
    //       >
    //         {savedAddress ? '✏️ Edit' : '📍 Add'}
    //       </button>
    //     </div>

    //     {/* Address Info + Actions */}
    //     <div className="p-4 space-y-4 flex flex-col">
    //       {/* Address Field or Preview */}
    //       {editing ? (
    //         <textarea
    //           rows={3}
    //           value={address}
    //           onChange={(e) => setAddress(e.target.value)}
    //           placeholder="Enter your delivery address..."
    //           className="w-full p-2 rounded border border-gray-300 text-sm"
    //         />
    //       ) : (
    //         <p className="text-sm text-gray-700">{address}</p>
    //       )}

    //       {/* Action Buttons */}
    //       <div className="flex justify-end gap-2">
    //         <button
    //           onClick={() => setEditing(false)}
    //           className="px-4 py-2 text-sm rounded bg-gray-200 hover:bg-gray-300 transition"
    //         >
    //           Cancel
    //         </button>
    //         <button
    //           onClick={() => {
    //             // Save logic goes here
    //             setEditing(false);
    //           }}
    //           className="px-4 py-2 text-sm rounded bg-theme-blue text-white hover:bg-theme-bluehighlighted transition"
    //         >
    //           {savedAddress ? 'Update' : 'Add'}
    //         </button>
    //       </div>
    //     </div>
    //   </div>
    // </div>
  );
};

export default AddressModal;
