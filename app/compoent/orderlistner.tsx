// app/components/OrderStatusListener.tsx
'use client';

import { useEffect, useRef } from 'react';
import { toast } from 'react-hot-toast';
import { usePastOrdersClient } from '../user/lib/SWR-hooks/usePastOrder';
import { useRouter } from 'next/navigation'; 
import { usePathname } from 'next/navigation';

export default function OrderStatusListener() {
  const pathname = usePathname();
  const { orders } = usePastOrdersClient(pathname.startsWith("/user"));
  const prevOrderStatus = useRef<Map<number, number>>(new Map());
  const hasLoadedOnce = useRef(false);
    const router = useRouter();
   useEffect(() => {
  if (!Array.isArray(orders)) return;

  // On first load: just record the initial statuses, no toast
  if (!hasLoadedOnce.current) {
    for (const order of orders) {
      prevOrderStatus.current.set(order.id, order.status);
    }
    hasLoadedOnce.current = true;
    return; // ✅ Exit early, skip toast logic
  }

  // On subsequent updates: compare statuses
  for (const order of orders) {
    const prevStatus = prevOrderStatus.current.get(order.id);

    if (order.status === 2 && prevStatus !== 2) {
      // Order just transitioned to "Delivered"
      toast(
        () => (
          <div
            onClick={() => {
              router.push('/user/orders/past');
              //toast.dismiss(t.id);
            }}
            className="cursor-pointer"
          >
                      <strong>
              Order #{order.id} has been delivered! (
              {order.items.map((item) => `${item.name} x${item.quantity}`).join(', ')})
            </strong>
            <div>Click here to rate your order.</div>
          </div>
        ),
        { duration: 100000 }
      );
    }

    // Update status for next comparison
    prevOrderStatus.current.set(order.id, order.status);
  }
}, [orders, router]);
//console.log('orders:', orders);


//   useEffect(() => {
//     if (!orders) return;

//     if (!hasLoadedOnce.current) {
//       for (const order of orders) {
//         prevOrderStatus.current.set(order.id, order.status);
//       }
//       hasLoadedOnce.current = true;
//       return;
//     }

//     for (const order of orders) {
//       const prevStatus = prevOrderStatus.current.get(order.id);

//       if (order.status === 2 && prevStatus !== 2) {
        
//        toast(
//   (t) => (
//     <div
//       onClick={() => {
//         router.push('/user/orders/past');
//         toast.dismiss(t.id); 
//       }}
//       className="cursor-pointer"
//     >
//       <strong>Order #{order.id} has been delivered!</strong>
//       <div>Click here to rate your order.</div>
//     </div>
//   ),
//   {
//     duration: 20000,
//   }
// );

//       }

//       prevOrderStatus.current.set(order.id, order.status);
//     }
//   }, [orders]);

  return null;
}
