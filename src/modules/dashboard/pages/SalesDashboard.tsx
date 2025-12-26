import { FileText, ShoppingCart, TrendingUp, Users } from 'lucide-react';
import { DashboardCard } from '@/modules/dashboard/components/DashboardCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const quotations = [
  { id: 'QUO-101', customer: 'Raj Kumar', amount: 125000, status: 'pending', date: '2025-01-10' },
  { id: 'QUO-102', customer: 'Priya Singh', amount: 85000, status: 'approved', date: '2025-01-12' },
  { id: 'QUO-103', customer: 'Amit Patel', amount: 95000, status: 'pending', date: '2025-01-13' },
];

const pipelineData = [
  { name: 'Quotations', value: 45, color: 'hsl(var(--primary))' },
  { name: 'Orders', value: 32, color: 'hsl(var(--accent))' },
  { name: 'Invoiced', value: 28, color: 'hsl(var(--muted))' },
];

const topCustomers = [
  { name: 'Raj Kumar', orders: 12, value: 450000 },
  { name: 'Priya Singh', orders: 8, value: 320000 },
  { name: 'Amit Patel', orders: 6, value: 280000 },
];

export default function SalesDashboard() {
  return (
    <div className="space-y-4 md:space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold">Sales Dashboard</h1>
        <p className="text-sm md:text-base text-muted-foreground">Manage quotations, orders, and customer relationships</p>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <DashboardCard
          title="Active Quotations"
          value="18"
          icon={FileText}
          description="Pending approval"
        />
        <DashboardCard
          title="Custom Orders"
          value="7"
          icon={ShoppingCart}
          description="In production"
        />
        <DashboardCard
          title="Conversion Rate"
          value="68%"
          icon={TrendingUp}
          description="Quotation to order"
          trend={{ value: 5.3, isPositive: true }}
        />
        <DashboardCard
          title="Active Customers"
          value="142"
          icon={Users}
          description="This month"
        />
      </div>

      {/* Charts and Actions */}
      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="hover-lift">
          <CardHeader>
            <CardTitle className="text-base md:text-lg">Sales Pipeline</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={pipelineData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pipelineData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="hover-lift">
          <CardHeader>
            <CardTitle className="text-base md:text-lg">Top Customers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topCustomers.map((customer, index) => (
                <div key={index} className="flex items-center justify-between gap-2 border-b border-border pb-3 last:border-0">
                  <div className="flex-1">
                    <p className="font-medium text-sm md:text-base">{customer.name}</p>
                    <p className="text-xs md:text-sm text-muted-foreground">{customer.orders} orders</p>
                  </div>
                  <p className="font-bold text-primary text-sm md:text-base whitespace-nowrap">₹{customer.value.toLocaleString()}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Active Quotations */}
      <Card className="hover-lift">
        <CardHeader>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <CardTitle className="text-base md:text-lg">Active Quotations</CardTitle>
            <Button size="sm" className="sm:size-default">New Quotation</Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {quotations.map((quote) => (
              <div key={quote.id} className="flex flex-col sm:flex-row items-start sm:items-center gap-3 border-b border-border pb-4 last:border-0">
                <div className="flex-1 w-full">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-sm md:text-base">{quote.id}</p>
                    <Badge variant={quote.status === 'approved' ? 'default' : 'secondary'} className="text-xs">
                      {quote.status}
                    </Badge>
                  </div>
                  <p className="text-xs md:text-sm text-muted-foreground">{quote.customer}</p>
                </div>
                <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-4 w-full sm:w-auto">
                  <div className="text-left sm:text-right">
                    <p className="font-bold text-sm md:text-base">₹{quote.amount.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">{quote.date}</p>
                  </div>
                  <Button variant="outline" size="sm" className="whitespace-nowrap">
                    Convert to Order
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
