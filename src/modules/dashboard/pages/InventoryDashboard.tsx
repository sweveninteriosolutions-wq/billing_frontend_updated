// src/modules/dashboard/pages/InventoryDashboard.tsx
import { Package, AlertTriangle, ArrowLeftRight, Truck } from 'lucide-react';
import { DashboardCard } from '@/modules/dashboard/components/DashboardCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { useDashboardLowStock } from '@/queries/dashboard.queries';
import { useStockTransfers } from '@/queries/stockTransfer.queries';
import { useInventoryBalances } from '@/queries/inventoryBalance.queries';
import { useSuppliers } from '@/queries/supplier.queries';
import { useProducts } from '@/queries/product.queries';

export default function InventoryDashboard() {
  const { data: lowStock, isLoading: lowStockLoading } = useDashboardLowStock();
  const { data: transfers } = useStockTransfers({ page: 1, page_size: 5, status: 'pending' });
  const { data: balances } = useInventoryBalances({ page: 1, page_size: 1 });
  const { data: suppliers } = useSuppliers({ page: 1, page_size: 1 });
  const { data: products } = useProducts({ page: 1, page_size: 1 });
  const { data: recentTransfers } = useStockTransfers({ page: 1, page_size: 4 });

  return (
    <div className="space-y-4 md:space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold">Inventory Dashboard</h1>
        <p className="text-sm md:text-base text-muted-foreground">Real-time stock levels, transfers, and supplier summary</p>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <DashboardCard
          title="Total Products"
          value={String(products?.total ?? '—')}
          icon={Package}
          description="In catalog"
        />
        <DashboardCard
          title="Low Stock Alerts"
          value={String(lowStock?.length ?? '—')}
          icon={AlertTriangle}
          description="Below threshold"
        />
        <DashboardCard
          title="Pending Transfers"
          value={String(transfers?.total ?? '—')}
          icon={ArrowLeftRight}
          description="Awaiting approval"
        />
        <DashboardCard
          title="Active Suppliers"
          value={String(suppliers?.total ?? '—')}
          icon={Truck}
          description="On record"
        />
      </div>

      {/* Low Stock Alerts */}
      <Card className="hover-lift">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base md:text-lg">
            <AlertTriangle className="h-4 w-4 md:h-5 md:w-5 text-destructive" />
            Low Stock Alerts
          </CardTitle>
        </CardHeader>
        <CardContent>
          {lowStockLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-16 rounded" />
              ))}
            </div>
          ) : !lowStock?.length ? (
            <p className="text-sm text-muted-foreground text-center py-4">✅ All products are sufficiently stocked.</p>
          ) : (
            <div className="space-y-4">
              {lowStock.slice(0, 6).map((alert: any) => {
                const pct = alert.min_stock_threshold > 0
                  ? Math.min(100, Math.round((alert.total_stock / alert.min_stock_threshold) * 100))
                  : 0;
                return (
                  <div key={alert.product_id} className="space-y-2 border-b border-border pb-4 last:border-0">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex-1">
                        <p className="font-medium text-sm md:text-base">{alert.name}</p>
                        <p className="text-xs md:text-sm text-muted-foreground">{alert.sku}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-destructive text-sm md:text-base whitespace-nowrap">
                          {alert.total_stock} units
                        </p>
                        <p className="text-xs text-muted-foreground">Min: {alert.min_stock_threshold}</p>
                      </div>
                    </div>
                    <Progress value={pct} className="h-2" />
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Stock Transfers */}
      <Card className="hover-lift">
        <CardHeader>
          <CardTitle className="text-base md:text-lg">Recent Stock Transfers</CardTitle>
        </CardHeader>
        <CardContent>
          {!recentTransfers?.items?.length ? (
            <p className="text-sm text-muted-foreground text-center py-4">No recent transfers.</p>
          ) : (
            <div className="space-y-4">
              {recentTransfers.items.map((t: any) => (
                <div key={t.id} className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 border-b border-border pb-4 last:border-0">
                  <div className="flex-1">
                    <p className="font-medium text-sm md:text-base">ST-{t.id}</p>
                    <p className="text-xs md:text-sm text-muted-foreground">
                      {t.from_location_name ?? `Loc #${t.from_location_id}`}
                      {' → '}
                      {t.to_location_name ?? `Loc #${t.to_location_id}`}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                    <div className="text-left sm:text-center">
                      <p className="font-medium text-sm md:text-base">{t.product_name ?? `Product #${t.product_id}`}</p>
                      <Badge variant="secondary" className="text-xs">Qty: {t.quantity}</Badge>
                    </div>
                    <Badge
                      variant={t.status === 'completed' ? 'default' : t.status === 'pending' ? 'secondary' : 'outline'}
                      className="text-xs capitalize"
                    >
                      {t.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
