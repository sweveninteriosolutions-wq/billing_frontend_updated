// 'use client';

// import { useEffect, useState } from 'react';
// import { Bell, Loader2, Package } from 'lucide-react';
// import { Button } from '@/components/ui/button';
// import { Badge } from '@/components/ui/badge';
// import {
//   Popover,
//   PopoverContent,
//   PopoverTrigger,
// } from '@/components/ui/popover';
// import { ScrollArea } from '@/components/ui/scroll-area';
// import { notificationApi, StockAlert } from '@/services/notificationApi';
// import { toast } from 'sonner';

// export default function NotificationBell() {
//   const [alerts, setAlerts] = useState<StockAlert[]>([]);
//   const [loading, setLoading] = useState(false);

//   const fetchAlerts = async () => {
//     try {
//       setLoading(true);
//       const res = await notificationApi.getStockAlerts();
//       setAlerts(res.data || []);
//     } catch (error) {
//       console.error(error);
//       toast.error('Failed to load stock alerts');
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchAlerts();
//   }, []);

//   const unreadCount = alerts.length;

//   return (
//     <Popover>
//       <PopoverTrigger asChild>
//         <Button variant="ghost" size="icon" className="relative">
//           <Bell className="h-5 w-5" />
//           {unreadCount > 0 && (
//             <Badge
//               variant="destructive"
//               className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
//             >
//               {unreadCount}
//             </Badge>
//           )}
//         </Button>
//       </PopoverTrigger>

//       <PopoverContent className="w-80 p-0" align="end">
//         <div className="border-b p-4 flex justify-between items-center">
//           <h3 className="font-semibold">Stock Alerts</h3>
//           <Button
//             size="sm"
//             variant="outline"
//             onClick={fetchAlerts}
//             disabled={loading}
//             className="h-6 text-xs"
//           >
//             {loading ? <Loader2 className="h-3 w-3 animate-spin" /> : 'Refresh'}
//           </Button>
//         </div>

//         <ScrollArea className="h-80">
//           <div className="p-2">
//             {loading ? (
//               <div className="flex justify-center items-center h-60 text-muted-foreground">
//                 <Loader2 className="animate-spin mr-2" /> Loading alerts...
//               </div>
//             ) : alerts.length > 0 ? (
//               alerts.map((alert) => (
//                 <div
//                   key={alert.product_id}
//                   className="p-3 rounded-lg hover:bg-muted/50 cursor-pointer mb-2 transition-colors"
//                 >
//                   <div className="flex items-start gap-2">
//                     <Package className="h-4 w-4 mt-1 text-destructive" />
//                     <div className="flex-1">
//                       <p className="font-medium text-sm">
//                         {alert.product_name}
//                       </p>
//                       <p className="text-xs text-muted-foreground mt-1">
//                         Stock: {alert.quantity_total} / Min: {alert.min_stock_threshold}
//                       </p>
//                       <p className="text-xs text-yellow-600 mt-1 font-medium">
//                         ⚠️ Below stock threshold
//                       </p>
//                     </div>
//                   </div>
//                 </div>
//               ))
//             ) : (
//               <div className="p-8 text-center text-muted-foreground">
//                 All stocks are above threshold ✅
//               </div>
//             )}
//           </div>
//         </ScrollArea>
//       </PopoverContent>
//     </Popover>
//   );
// }
