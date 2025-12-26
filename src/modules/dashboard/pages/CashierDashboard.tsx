import { DollarSign, Receipt, AlertCircle, Users } from 'lucide-react';
import { DashboardCard } from '@/modules/dashboard/components/DashboardCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const pendingPayments = [
  { id: 'INV-1234', customer: 'Raj Kumar', amount: 45000, dueDate: '2025-01-15', status: 'overdue' },
  { id: 'INV-1235', customer: 'Priya Singh', amount: 32000, dueDate: '2025-01-20', status: 'due' },
  { id: 'INV-1236', customer: 'Amit Patel', amount: 28000, dueDate: '2025-01-25', status: 'due' },
];

const recentCustomers = [
  { name: 'Raj Kumar', amount: 45000, time: '10 mins ago' },
  { name: 'Priya Singh', amount: 32000, time: '25 mins ago' },
  { name: 'Amit Patel', amount: 28000, time: '1 hour ago' },
  { name: 'Sneha Reddy', amount: 19500, time: '2 hours ago' },
];

export default function CashierDashboard() {
  return (
    <div className="space-y-4 md:space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold">Cashier Dashboard</h1>
        <p className="text-sm md:text-base text-muted-foreground">Manage sales, invoices, and payments</p>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <DashboardCard
          title="Today's Sales"
          value="₹1.2L"
          icon={DollarSign}
          description="12 transactions"
          trend={{ value: 8.5, isPositive: true }}
        />
        <DashboardCard
          title="Invoices Generated"
          value="12"
          icon={Receipt}
          description="Today"
        />
        <DashboardCard
          title="Pending Payments"
          value="₹1.05L"
          icon={AlertCircle}
          description="3 invoices"
        />
        <DashboardCard
          title="Customers Served"
          value="12"
          icon={Users}
          description="Today"
        />
      </div>

      {/* Quick Actions */}
      <Card className="hover-lift">
        <CardHeader>
          <CardTitle className="text-base md:text-lg">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col sm:flex-row gap-3 md:gap-4">
          <Button className="flex-1">
            <Receipt className="mr-2 h-4 w-4" />
            <span className="text-sm md:text-base">New Invoice</span>
          </Button>
          <Button variant="outline" className="flex-1">
            <span className="text-sm md:text-base">Record Payment</span>
          </Button>
          <Button variant="outline" className="flex-1">
            <span className="text-sm md:text-base">Export Report</span>
          </Button>
        </CardContent>
      </Card>

      {/* Pending Payments */}
      <Card className="hover-lift">
        <CardHeader>
          <CardTitle className="text-base md:text-lg">Pending Payments</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {pendingPayments.map((payment) => (
              <div key={payment.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-4 border-b border-border pb-4 last:border-0">
                <div className="flex-1">
                  <p className="font-medium text-sm md:text-base">{payment.customer}</p>
                  <p className="text-xs md:text-sm text-muted-foreground">Invoice: {payment.id}</p>
                </div>
                <div className="text-left sm:text-right">
                  <p className="font-bold text-sm md:text-base">₹{payment.amount.toLocaleString()}</p>
                  <Badge variant={payment.status === 'overdue' ? 'destructive' : 'secondary'} className="text-xs">
                    Due: {payment.dueDate}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Customers */}
      <Card className="hover-lift">
        <CardHeader>
          <CardTitle className="text-base md:text-lg">Recent Customers</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentCustomers.map((customer, index) => (
              <div key={index} className="flex items-center justify-between gap-2">
                <div className="flex-1">
                  <p className="font-medium text-sm md:text-base">{customer.name}</p>
                  <p className="text-xs text-muted-foreground">{customer.time}</p>
                </div>
                <p className="font-bold text-primary text-sm md:text-base whitespace-nowrap">₹{customer.amount.toLocaleString()}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
