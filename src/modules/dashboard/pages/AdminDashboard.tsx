import { DollarSign, Package, AlertCircle, Users, TrendingUp, ShoppingCart } from 'lucide-react';
import { DashboardCard } from '@/modules/dashboard/components/DashboardCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const salesData = [
  { month: 'Jan', sales: 45000, orders: 120 },
  { month: 'Feb', sales: 52000, orders: 145 },
  { month: 'Mar', sales: 48000, orders: 132 },
  { month: 'Apr', sales: 61000, orders: 168 },
  { month: 'May', sales: 55000, orders: 152 },
  { month: 'Jun', sales: 67000, orders: 189 },
];

const recentActivity = [
  { user: 'Cashier User', action: 'Generated invoice #INV-1234', time: '5 mins ago' },
  { user: 'Sales Executive', action: 'Created quotation for Raj Kumar', time: '12 mins ago' },
  { user: 'Inventory Manager', action: 'Updated stock for Sofa Set Premium', time: '25 mins ago' },
  { user: 'Admin User', action: 'Added discount rule: Summer Sale', time: '1 hour ago' },
];

export default function AdminDashboard() {
  return (
    <div className="space-y-4 md:space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-sm md:text-base text-muted-foreground">Complete overview of your business operations</p>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <DashboardCard
          title="Total Sales"
          value="₹3.2L"
          icon={DollarSign}
          description="This month"
          trend={{ value: 12.5, isPositive: true }}
        />
        <DashboardCard
          title="Inventory Value"
          value="₹8.5L"
          icon={Package}
          description="Current stock"
          trend={{ value: 3.2, isPositive: true }}
        />
        <DashboardCard
          title="Pending Payments"
          value="₹45K"
          icon={AlertCircle}
          description="3 invoices due"
          trend={{ value: -5.1, isPositive: false }}
        />
        <DashboardCard
          title="Total Customers"
          value="347"
          icon={Users}
          description="Active customers"
          trend={{ value: 8.3, isPositive: true }}
        />
      </div>

      {/* Charts */}
      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="hover-lift">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base md:text-lg">
              <TrendingUp className="h-4 w-4 md:h-5 md:w-5 text-primary" />
              Sales Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="sales" stroke="hsl(var(--primary))" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="hover-lift">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base md:text-lg">
              <ShoppingCart className="h-4 w-4 md:h-5 md:w-5 text-primary" />
              Order Volume
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="orders" fill="hsl(var(--primary))" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="hover-lift">
        <CardHeader>
          <CardTitle className="text-base md:text-lg">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex flex-col sm:flex-row items-start sm:justify-between gap-2 border-b border-border pb-4 last:border-0">
                <div className="flex-1">
                  <p className="font-medium text-sm md:text-base">{activity.user}</p>
                  <p className="text-xs md:text-sm text-muted-foreground">{activity.action}</p>
                </div>
                <span className="text-xs text-muted-foreground whitespace-nowrap">{activity.time}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
