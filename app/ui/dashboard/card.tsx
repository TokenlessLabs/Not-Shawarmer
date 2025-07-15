import Image from "next/image";

export default function ProductCard() {
  return (
    <>
     <div className="max-w-xs rounded-2xl overflow-hidden shadow-lg bg-white">
      <Image
        src="/images/burger.jpg" 
        alt="Product"
        width={400}
        height={300}
        className="w-full h-48 object-cover"
      />
      <div className="p-4 flex flex-row  justify-between">
        <p className="text-lg font-semibold  text-gray-800">  Item name </p>
        <p className="text-lg centered  text-gray-600">
          Rs. 2,499
        </p>
      </div>
    </div>
     <div className="max-w-xs rounded-2xl overflow-hidden shadow-lg bg-white">
      <Image
        src="/images/pizza.jpg" 
        alt="Product"
        width={400}
        height={300}
        className="w-full h-48 object-cover"
      />
      <div className="p-4 flex flex-row  justify-between">
        <p className="text-lg font-semibold  text-gray-800">  Item name </p>
        <p className="text-lg centered  text-gray-600">
          Rs. 2,499
        </p>
      </div>
    </div>

    </>
   
  );
}
