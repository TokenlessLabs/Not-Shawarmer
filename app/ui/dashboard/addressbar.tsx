export default function AddressBar() {
  return (
    <div className="flex justify-center w-full"> 
      <nav className="bg-theme-blue p-4 rounded-lg shadow-md flex items-center gap-4 w-full ">
        <label className="text-white whitespace-nowrap">
          Current Address:
        </label>

        <input
          type="text"
          placeholder="Enter address or search..."
          className="flex-grow px-4 py-2 bg-white text-black rounded-md border border-gray-300 focus:outline-none"
          defaultValue="Kalma Chock"
          readOnly
        />

        <button className="bg-white text-theme-blue font-semibold px-4 py-2 rounded-md border border-theme-blue hover:bg-theme-blue hover:text-white transition">
          Edit
        </button>
      </nav>
    </div>
  );
}
