// menu-item-card.tsx
"use client";
import Image from "next/image";
import { MenuItem } from "../../lib/definitions";

type CardProps = {
  item: MenuItem;
  onClick: () => void;
};

export default function Card({ item, onClick }: CardProps) {
  const imageUrl = item.image ? item.image : "/images/placeholder.jpg";
  return (
    <div
      className="max-w-xs rounded-2xl overflow-hidden shadow-lg bg-white cursor-pointer"
      onClick={onClick}
    >
      <Image
        src={imageUrl}
        alt={item.name}
        width={400}
        height={300}
        className="w-full h-48 object-cover"
      />
      <div className="p-4 flex flex-row justify-between">
        <p className="text-lg font-semibold text-gray-800">{item.name}</p>
        <p className="text-lg text-gray-600">
          Rs. {item.price.toLocaleString()}
        </p>
      </div>
    </div>
  );
}
