import { Package, AlertTriangle, ArrowLeftRight, Truck } from 'lucide-react';
import { DashboardCard } from '@/modules/dashboard/components/DashboardCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

const stockAlerts = [
  { product: 'Sofa Set Premium', current: 3, minimum: 5, location: 'Showroom' },
  { product: 'Dining Table Luxury', current: 2, minimum: 4, location: 'Warehouse' },
  { product: 'Office Chair Ergonomic', current: 8, minimum: 10, location: 'Showroom' },
];

const recentTransfers = [
  { id: 'ST-101', from: 'Warehouse', to: 'Showroom', item: 'Sofa Set', qty: 2, date: '2025-01-10' },
  { id: 'ST-102', from: 'Showroom', to: 'Warehouse', item: 'Dining Table', qty: 1, date: '2025-01-12' },
];

const suppliers = [
  { name: 'Modern Furniture Co.', rating: 4.5, deliveries: 45, onTime: 95 },
  { name: 'Luxury Interiors Ltd.', rating: 4.8, deliveries: 32, onTime: 98 },
  { name: 'Premium Woods Inc.', rating: 4.2, deliveries: 28, onTime: 89 },
];

export default function InventoryDashboard() {
  return (
    <div className="space-y-4 md:space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold">Inventory Dashboard</h1>
        <p className="text-sm md:text-base text-muted-foreground">Control stock, transfers, and supplier coordination</p>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <DashboardCard
          title="Total Items"
          value="347"
          icon={Package}
          description="In stock"
        />
        <DashboardCard
          title="Low Stock Alerts"
          value="12"
          icon={AlertTriangle}
          description="Need attention"
        />
        <DashboardCard
          title="Pending Transfers"
          value="5"
          icon={ArrowLeftRight}
          description="In transit"
        />
        <DashboardCard
          title="Active Suppliers"
          value="24"
          icon={Truck}
          description="Verified"
        />
      </div>

      {/* Quick Actions */}
      <Card className="hover-lift">
        <CardHeader>
          <CardTitle className="text-base md:text-lg">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col sm:flex-row gap-3 md:gap-4">
          <Button className="flex-1">
            <ArrowLeftRight className="mr-2 h-4 w-4" />
            <span className="text-sm md:text-base">New Transfer</span>
          </Button>
          <Button variant="outline" className="flex-1">
            <span className="text-sm md:text-base">Add Product</span>
          </Button>
          <Button variant="outline" className="flex-1">
            <span className="text-sm md:text-base">Generate GRN</span>
          </Button>
        </CardContent>
      </Card>

      {/* Low Stock Alerts */}
      <Card className="hover-lift">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base md:text-lg">
            <AlertTriangle className="h-4 w-4 md:h-5 md:w-5 text-destructive" />
            Low Stock Alerts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {stockAlerts.map((alert, index) => (
              <div key={index} className="space-y-2 border-b border-border pb-4 last:border-0">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex-1">
                    <p className="font-medium text-sm md:text-base">{alert.product}</p>
                    <p className="text-xs md:text-sm text-muted-foreground">{alert.location}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-destructive text-sm md:text-base whitespace-nowrap">{alert.current} units</p>
                    <p className="text-xs text-muted-foreground">Min: {alert.minimum}</p>
                  </div>
                </div>
                <Progress value={(alert.current / alert.minimum) * 100} className="h-2" />
                <Button size="sm" variant="outline" className="w-full text-sm">
                  Reorder
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Transfers */}
      <Card className="hover-lift">
        <CardHeader>
          <CardTitle className="text-base md:text-lg">Recent Stock Transfers</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentTransfers.map((transfer) => (
              <div key={transfer.id} className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 border-b border-border pb-4 last:border-0">
                <div className="flex-1">
                  <p className="font-medium text-sm md:text-base">{transfer.id}</p>
                  <p className="text-xs md:text-sm text-muted-foreground">
                    {transfer.from} → {transfer.to}
                  </p>
                </div>
                <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                  <div className="text-left sm:text-center">
                    <p className="font-medium text-sm md:text-base">{transfer.item}</p>
                    <Badge variant="secondary" className="text-xs">Qty: {transfer.qty}</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground whitespace-nowrap">{transfer.date}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Supplier Performance */}
      <Card className="hover-lift">
        <CardHeader>
          <CardTitle className="text-base md:text-lg">Supplier Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {suppliers.map((supplier, index) => (
              <div key={index} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-border pb-4 last:border-0">
                <div className="flex-1">
                  <p className="font-medium text-sm md:text-base">{supplier.name}</p>
                  <p className="text-xs md:text-sm text-muted-foreground">{supplier.deliveries} deliveries</p>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs md:text-sm whitespace-nowrap">⭐ {supplier.rating}</span>
                  <Badge variant={supplier.onTime >= 95 ? 'default' : 'secondary'} className="text-xs">
                    {supplier.onTime}% on-time
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
